package imexport

import (
	"archive/zip"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"strconv"

	"github.com/google/uuid"
	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/modules/app"
	"rxdrag.com/entify/service"
	"rxdrag.com/entify/utils"
)

func (m *ImExportModule) QueryFields() []*graphql.Field {
	if !app.Installed {
		return []*graphql.Field{}
	}
	return []*graphql.Field{
		{
			Name: EXPORT_APP,
			Type: graphql.String,
			Args: graphql.FieldConfigArgument{
				ARG_SNAPSHOT_ID: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: graphql.ID,
					},
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer utils.PrintErrorStack()
				return m.exportResolve(p)
			},
		},
	}
}

func (m *ImExportModule) exportResolve(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()

	if p.Args[ARG_SNAPSHOT_ID] == nil {
		log.Panic("Snapshot id is nil")
	}

	snapshotId, err := strconv.ParseUint(p.Args[ARG_SNAPSHOT_ID].(string), 10, 64)

	if err != nil {
		log.Panic(err.Error())
	}
	s := service.New(p.Context, m.app.Model.Graph)
	appSnapshot := s.QueryById(m.app.GetEntityByName("Snapshot"), snapshotId)

	if appSnapshot == nil {
		log.Panicf("App snapshot is nil on id:%d", snapshotId)
	}
	appJson := appSnapshot.(map[string]interface{})["content"]

	if appJson == nil {
		log.Panic("App json in snapshot is nil")
	}
	hostPath := getHostPath(p.Context)

	folderFullPath := fmt.Sprintf("%s/app%d/%s", consts.STATIC_PATH, m.app.AppId, TEMP_DATAS)
	_, err = os.Stat(folderFullPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(folderFullPath, 0777)
		if err != nil {
			log.Panic(err.Error())
		}
	}
	zipFileName := fmt.Sprintf("%s/app_%s.zip", folderFullPath, uuid.New().String())

	fileUrl := fmt.Sprintf(
		"%s%s",
		hostPath,
		zipFileName,
	)

	file, err := os.Create(zipFileName)
	defer file.Close()

	if err != nil {
		log.Panic(err.Error())
	}

	w := zip.NewWriter(file)
	defer w.Close()

	if err != nil {
		log.Panic(err.Error())
	}

	//处理插件
	pluginsData := appJson.(utils.JSON)["plugins"]

	if pluginsData != nil {
		plugins := pluginsData.([]interface{})
		for i, pluginData := range plugins {
			plugin := pluginData.(map[string]interface{})
			pluginName := fmt.Sprintf("%d", i+1)
			urlData := plugin["url"]
			if urlData != nil && plugin["type"] != "debug" {
				url := urlData.(string)
				folderPath := url[len(hostPath):]

				zipPluginFolder(folderPath, pluginName, w)
				plugin["url"] = pluginName
			}
		}
	}

	//处理模板
	templatesData := appJson.(utils.JSON)[TEMPLATES_ATTR_NAME]

	if templatesData != nil {
		templates := templatesData.([]interface{})
		for _, templateData := range templates {
			template := templateData.(map[string]interface{})
			urlData := template["imageUrl"]
			if urlData != nil {
				url := urlData.(string)
				imagePath := url[len(hostPath):]
				fileName := filepath.Base(imagePath)
				_, err := os.Stat(imagePath)
				if err != nil {
					//如果文件不存在，删掉文件信息
					if os.IsNotExist(err) {
						template["imageUrl"] = ""
						continue
					}
				}

				zipTemplateFile(imagePath, fileName, w)
				template["imageUrl"] = fileName
			}
		}
	}

	//保存image文件
	if appJson.(utils.JSON)["imageUrl"] != nil {
		url := appJson.(utils.JSON)["imageUrl"].(string)
		if url != "" {
			imagePath := url[len(hostPath):]
			fileName := imagePath[len(IMAGE_PATH):]
			f, err := w.Create(fileName)
			if err != nil {
				log.Panic(err.Error())
			}

			r, err := os.Open(imagePath)
			defer r.Close()
			if err != nil {
				log.Panic(err.Error())
			}

			io.Copy(f, r)
			appJson.(utils.JSON)["imageUrl"] = imagePath
		}

	}

	//保存app.json
	f, err := w.Create(APP_JON)
	if err != nil {
		log.Panic(err.Error())
	}

	appStrBytes, err := json.Marshal(appJson)
	if err != nil {
		log.Panic(err.Error())
	}

	f.Write(appStrBytes)

	return fileUrl, nil
}

func zipTemplateFile(filePath, fileName string, w *zip.Writer) {
	f, err := w.Create("templates/" + fileName)
	if err != nil {
		log.Panic(err.Error())
	}

	r, err := os.Open(filePath)
	defer r.Close()
	if err != nil {
		log.Panic(err.Error())
	}

	io.Copy(f, r)
}

// Add folder to zip
func zipPluginFolder(folder string, pluginName string, w *zip.Writer) {
	walker := func(path string, info os.FileInfo, err error) error {
		log.Printf("Crawling: %#v\n", path)
		if err != nil {
			return err
		}
		if info.IsDir() {
			return nil
		}
		file, err := os.Open(path)
		if err != nil {
			return err
		}
		defer file.Close()

		// Ensure that `path` is not absolute; it should not start with "/".
		// This snippet happens to work because I don't use
		// absolute paths, but ensure your real-world code
		// transforms path into a zip-root relative path.
		f, err := w.Create("plugins/" + pluginName + "/" + info.Name())
		if err != nil {
			return err
		}

		_, err = io.Copy(f, file)
		if err != nil {
			return err
		}

		return nil
	}
	err := filepath.Walk(folder, walker)
	if err != nil {
		log.Panic(err.Error())
	}
}
