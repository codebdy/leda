package app

import (
	"sync"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/service"
)

var appLoaderCache sync.Map

var serviceMetas sync.Map

//加载微内核
func LoadServiceMetas() {
	clearServiceMetas()
	systemApp := GetSystemApp()
	s := service.NewSystem()

	services := s.QueryEntity(systemApp.GetEntityByName(meta.SERVICE_ENTITY_NAME), graph.QueryArg{}, []string{"id", "metaId"})

	for _, service := range services.Nodes {
		metaIdData := service["metaId"]
		if metaIdData != nil && metaIdData != 0 {
			metaData := s.QueryById(systemApp.GetEntityByName(meta.META_ENTITY_NAME), metaIdData.(uint64))
			if metaData != nil {
				metaMap := metaData.(map[string]interface{})
				publishedMeta := metaMap[consts.META_PUBLISHED_CONTENT]
				if publishedMeta != nil && publishedMeta != "" {
					var content *meta.MetaContent
					if publishedMeta != nil {
						content = DecodeContent(publishedMeta)
					}
					serviceMetas.Store(metaMap["id"], content)
				}
			}
		}
	}
}

func clearServiceMetas() {
	serviceMetas.Range(func(key interface{}, value interface{}) bool {
		serviceMetas.Delete(key)
		return true
	})
}
