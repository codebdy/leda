package resolve

import (
	"fmt"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/common/contexts"
	"rxdrag.com/entify/config"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/storage"
	"rxdrag.com/entify/utils"
)

func GetFileUrl(fileInfo storage.FileInfo, p graphql.ResolveParams) (interface{}, error) {
	if config.Storage() == consts.LOCAL {
		return fmt.Sprintf(
			"http://%s/%s/%s",
			contexts.Values(p.Context).Host,
			consts.STATIC_PATH,
			fileInfo.Path,
		), nil
	} else {
		return fileInfo.Path, nil
	}
}

func FileUrlResolve(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()
	if p.Source != nil {
		fileInfo := p.Source.(storage.FileInfo)
		return GetFileUrl(fileInfo, p)
	}
	return nil, nil
}
