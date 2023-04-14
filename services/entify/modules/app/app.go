package app

import (
	"errors"
	"log"
	"sync"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/model"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app/schema"
	"codebdy.com/leda/services/entify/modules/app/schema/parser"
	"codebdy.com/leda/services/entify/service"
	"github.com/mitchellh/mapstructure"
)

//节省开支，运行时使用，初始化时请使用orm.IsEntityExists
var Installed = false

type App struct {
	AppId  uint64
	Model  *model.Model
	Schema schema.AppGraphqlSchema
	Parser *parser.ModelParser
}

type AppLoader struct {
	appId  uint64
	app    *App
	loaded bool
	sync.Mutex
}

func (l *AppLoader) load(force bool) {
	l.Lock()
	defer l.Unlock()
	if !l.loaded || force {
		log.Println("加载", l.appId)
		l.app = NewApp(l.appId)
		if l.app == nil {
			log.Panic(errors.New("Cant load app"))
		}
		l.loaded = true
	}
}

// func GetAppByIdArg(idArg interface{}) (*App, error) {
// 	if idArg == nil {
// 		err := errors.New("Nil app id")
// 		log.Panic(err.Error())
// 	}
// 	appIdStr := idArg.(string)
// 	appId, err := strconv.ParseUint(appIdStr, 10, 64)

// 	if err != nil {
// 		err := errors.New(fmt.Sprintf("App id error:%s", appIdStr))
// 		log.Panic(err.Error())
// 	}
// 	return Get(appId)
// }

func Get(appId uint64) (*App, error) {
	if result, ok := appLoaderCache.Load(appId); ok {
		if !result.(*AppLoader).loaded {
			result.(*AppLoader).load(false)
		}
		return result.(*AppLoader).app, nil
	} else {
		appLoader := &AppLoader{
			appId:  appId,
			loaded: false,
		}
		appLoaderCache.Store(appId, appLoader)
		appLoader.load(false)
		if appId == 0 {
			model.SystemModel = appLoader.app.Model
		}
		return appLoader.app, nil
	}
}

// func GetSystemApp() *App {
// 	if result, ok := appLoaderCache.Load(meta.SYSTEM_APP_ID); ok {
// 		loader := result.(*AppLoader)
// 		if !loader.loaded {
// 			loader.load(false)
// 		}
// 		return loader.app
// 	}

// 	return GetPredefinedSystemApp()
// }

// func GetPredefinedSystemApp() *App {

// 	metaConent := meta.SystemMeta["meta"].(meta.MetaContent)
// 	return &App{
// 		AppId: meta.SystemMeta["id"].(uint64),
// 		Model: model.New(&metaConent, meta.SYSTEM_APP_ID),
// 	}
// }

func (a *App) GetEntityByName(name string) *graph.Entity {
	return a.Model.Graph.GetEntityByName(name)
}

func (a *App) GetEntityByInnerId(innerId uint64) *graph.Entity {
	return a.Model.Graph.GetEntityByInnerId(innerId)
}

func (a *App) ReLoad() {
	if result, ok := appLoaderCache.Load(a.AppId); ok {
		result.(*AppLoader).load(true)
	}
}

func NewApp(appId uint64) *App {
	systemApp := getPredefinedSystemApp()
	if appId == 0 {
		return systemApp
	}

	s := service.NewSystem()
	appData := s.QueryById(
		systemApp.GetEntityByName(meta.APP_ENTITY_NAME),
		appId,
	)

	if appData == nil {
		return nil
	}
	appMeta := s.QueryById(
		systemApp.GetEntityByName(meta.META_ENTITY_NAME),
		appData.(map[string]interface{})["metaId"].(uint64),
	)

	if appMeta == nil {
		return nil
	}

	publishedMeta := appMeta.(map[string]interface{})[consts.META_PUBLISHED_CONTENT]
	var content *meta.MetaContent
	if publishedMeta != nil {
		content = DecodeContent(publishedMeta)
	}

	content = MergeServiceModels(content)

	model := model.New(content, appId)
	schema := schema.New(model)

	return &App{
		AppId:  appId,
		Model:  model,
		Schema: schema,
		Parser: schema.Parser(),
	}
}

func DecodeContent(obj interface{}) *meta.MetaContent {
	content := meta.MetaContent{}
	if obj != nil {
		err := mapstructure.Decode(obj, &content)
		if err != nil {
			panic("Decode content failure:" + err.Error())
		}
	}
	return &content
}

//合并微服务模型
func MergeServiceModels(content *meta.MetaContent) *meta.MetaContent {
	if content == nil {
		content = &meta.MetaContent{}
	}
	serviceMetas.Range(func(key interface{}, value interface{}) bool {
		if metaData, ok := serviceMetas.Load(key); ok {
			serviceMeta := metaData.(*meta.MetaContent)
			for i := range serviceMeta.Classes {
				content.Classes = append(content.Classes, serviceMeta.Classes[i])
			}

			for i := range serviceMeta.Relations {
				content.Relations = append(content.Relations, serviceMeta.Relations[i])
			}
		}
		return true
	})
	return content
}

func GetSystemApp() *App {
	if result, ok := appLoaderCache.Load(0); ok {
		loader := result.(*AppLoader)
		if !loader.loaded {
			loader.load(false)
		}
		return loader.app
	}

	return getPredefinedSystemApp()
}

func getPredefinedSystemApp() *App {
	metaConent := meta.SystemMeta[consts.META_CONTENT].(meta.MetaContent)
	meragedMetaConent := MergeServiceModels(&metaConent)
	model := model.New(meragedMetaConent, 0)
	schema := schema.New(model)
	return &App{
		AppId:  0,
		Schema: schema,
		Parser: schema.Parser(),
		Model:  model,
	}
}
