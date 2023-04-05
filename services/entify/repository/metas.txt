package repository

import (
	"github.com/mitchellh/mapstructure"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/model"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/meta"
	"rxdrag.com/entify/utils"
)

func (r *Repository) QueryAppId(appUuid string) uint64 {
	if appUuid == consts.SYSTEM_APP_UUID {
		return 0
	}
	appData := r.QueryOneEntity(r.Model.Graph.GetEntityByName("App"), graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			consts.UUID: graph.QueryArg{
				consts.ARG_EQ: appUuid,
			},
		},
	})

	if appData != nil {
		return appData.(map[string]interface{})[consts.ID].(uint64)
	}

	return 0
}

func (r *Repository) QueryPublishedMeta(appUuid string) interface{} {
	var idOrderBy interface{}
	idOrderBy = map[string]interface{}{
		consts.ID: "desc",
	}

	publishedMeta := r.QueryOneEntity(r.Model.Graph.GetMetaEntity(), graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			consts.ARG_AND: []graph.QueryArg{
				{
					consts.META_STATUS: graph.QueryArg{
						consts.ARG_EQ: meta.META_STATUS_PUBLISHED,
					},
				},
				{
					consts.META_APP_UUID: graph.QueryArg{
						consts.ARG_EQ: appUuid,
					},
				},
			},
		},
		consts.ARG_ORDERBY: []interface{}{
			idOrderBy,
		},
	})

	return publishedMeta
}

func (r *Repository) QueryNextMeta(appUuid string) interface{} {
	var idOrderBy interface{}
	idOrderBy = map[string]interface{}{
		consts.ID: "desc",
	}

	nextMeta := r.QueryOneEntity(r.Model.Graph.GetMetaEntity(), graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			consts.ARG_AND: []graph.QueryArg{
				{
					consts.META_STATUS: graph.QueryArg{
						consts.ARG_ISNULL: true,
					},
				},
				{
					consts.META_APP_UUID: graph.QueryArg{
						consts.ARG_EQ: appUuid,
					},
				},
			},
		},
		consts.ARG_ORDERBY: []interface{}{
			idOrderBy,
		},
	})

	return nextMeta
}

func DecodeContent(obj interface{}, appId uint64) *meta.MetaContent {
	content := meta.MetaContent{}
	if obj != nil {
		err := mapstructure.Decode(obj.(utils.Object)[consts.META_CONTENT], &content)
		if err != nil {
			panic("Decode content failure:" + err.Error())
		}
	}
	//放置AappId
	for i := range content.Classes {
		content.Classes[i].AppId = appId
	}

	for i := range content.Relations {
		content.Relations[i].AppId = appId
	}
	return &content
}

func (r *Repository) LoadAndDecodeMeta(appUuid string) (*meta.MetaContent, uint64) {
	appId := r.QueryAppId(appUuid)
	publishedMeta := r.QueryPublishedMeta(appUuid)
	publishedContent := DecodeContent(publishedMeta, appId)

	return publishedContent, appId
}

func (r *Repository) MergeModel(appUuid string, content *meta.MetaContent) *meta.MetaContent {
	//合并系统Schema
	if appUuid != consts.SYSTEM_APP_UUID {
		//systemMetaContent := r.LoadAndDecodeMeta(consts.SYSTEM_APP_UUID)
		for i := range r.Model.Meta.Classes {
			content.Classes = append(content.Classes, *r.Model.Meta.Classes[i])
		}

		for i := range r.Model.Meta.Relations {
			content.Relations = append(content.Relations, *r.Model.Meta.Relations[i])
		}
	}
	return content
}

func (r *Repository) LoadModel(appUuid string) *model.Model {
	publishedContent, appId := r.LoadAndDecodeMeta(appUuid)
	publishedContent.Classes = append(publishedContent.Classes,
		meta.MetaStatusEnum,
		meta.MetaClass,
		meta.EntityAuthSettingsClass,
		meta.AbilityTypeEnum,
		meta.AbilityClass,
	)

	r.MergeModel(appUuid, publishedContent)
	// //合并系统Schema
	// if appUuid != consts.SYSTEM_APP_UUID {
	// 	//systemMetaContent := r.LoadAndDecodeMeta(consts.SYSTEM_APP_UUID)
	// 	for i := range r.Model.Meta.Classes {
	// 		publishedContent.Classes = append(publishedContent.Classes, *r.Model.Meta.Classes[i])
	// 	}

	// 	for i := range r.Model.Meta.Relations {
	// 		publishedContent.Relations = append(publishedContent.Relations, *r.Model.Meta.Relations[i])
	// 	}
	// }

	m := model.New(appUuid, publishedContent)
	m.AppId = appId
	return m
}
