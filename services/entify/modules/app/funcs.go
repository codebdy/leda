package app

import (
	"codebdy.com/leda/services/entify/model/meta"
	"github.com/mitchellh/mapstructure"
)

func ReLoadApp(appId uint64) {
	if result, ok := appLoaderCache.Load(appId); ok {
		result.(*AppLoader).load(true)
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
	ServiceMetas.Range(func(key interface{}, value interface{}) bool {
		if metaData, ok := ServiceMetas.Load(key); ok {
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
