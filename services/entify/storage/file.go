package storage

import (
	"fmt"
	"io"
	"mime/multipart"
	"os"
	"path/filepath"

	"codebdy.com/leda/services/entify/consts"
	"github.com/google/uuid"
)

type File struct {
	File     multipart.File
	Filename string
	Size     int64
	AppId    uint64
}

type FileInfo struct {
	Dir      string `json:"dir"`
	Path     string `json:"path"`
	NameBody string `json:"nameBody"`
	Size     int64  `json:"size"`
	MimeType string `json:"mimeType"`
	ExtName  string `json:"extName"`
}

var mimeTypes = map[string]string{
	".css":  "text/css; charset=utf-8",
	".gif":  "image/gif",
	".htm":  "text/html; charset=utf-8",
	".html": "text/html; charset=utf-8",
	".jpg":  "image/jpeg",
	".js":   "application/x-javascript",
	".pdf":  "application/pdf",
	".png":  "image/png",
	".xml":  "text/xml; charset=utf-8",
}

func (f *File) extName() string {
	return filepath.Ext(f.Filename)
}

func (f *File) mimeType() string {
	//mtype, err := mimetype.DetectReader(f.File)

	return mimeTypes[f.extName()]
}

func (f *File) Save(folder string) FileInfo {
	nameBody := uuid.New().String()
	name := fmt.Sprintf("%s%s", nameBody, f.extName())
	folderFullPath := fmt.Sprintf("./%s/app%d/%s", consts.STATIC_PATH, f.AppId, folder)
	_, err := os.Stat(folderFullPath)
	if os.IsNotExist(err) {
		err = os.MkdirAll(folderFullPath, 0777)
		if err != nil {
			panic(err.Error())
		}
	}
	localPath := fmt.Sprintf("%s/%s", folderFullPath, name)
	file, err := os.OpenFile(
		localPath,
		os.O_WRONLY|os.O_CREATE,
		0666,
	)
	defer file.Close()
	if err != nil {
		panic(err.Error())
	}
	io.Copy(file, f.File)
	dir := fmt.Sprintf("app%d/%s/", f.AppId, folder)
	path := fmt.Sprintf(dir + name)
	return FileInfo{
		Dir:      dir,
		Path:     path,
		NameBody: nameBody,
		Size:     f.Size,
		MimeType: f.mimeType(),
		ExtName:  f.extName(),
	}
}
