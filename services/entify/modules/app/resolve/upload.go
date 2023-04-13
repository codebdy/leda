package resolve

import (
	"log"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/storage"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"github.com/graphql-go/graphql"
)

func UploadResolveResolve(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()
	file := p.Args[consts.ARG_FILE].(storage.File)
	fileInfo := file.Save(consts.UPLOAD_PATH)
	return GetFileUrl(fileInfo, p)
}

func UploadZipResolveResolve(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()
	file := p.Args[consts.ARG_FILE].(storage.File)
	folder := p.Args[consts.ARG_FOLDER].(string)
	fileInfo := file.Save(folder)
	err := storage.Unzip(fileInfo.Path, fileInfo.Dir+fileInfo.NameBody)
	if err != nil {
		log.Panic(err.Error())
	}
	return GetFileUrl(fileInfo, p)
}
