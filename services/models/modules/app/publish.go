package app

import (
	"codebdy.com/leda/services/models/model"
	"codebdy.com/leda/services/models/model/meta"
	"codebdy.com/leda/services/models/orm"
)

func PublishMeta(published, next *meta.MetaContent, appId uint64) {
	publishedModel := model.New(published, appId)
	nextModel := model.New(next, appId)
	diff := model.CreateDiff(publishedModel, nextModel)
	orm.Migrage(diff)
}

// func (a *App) Publish(ctx context.Context) {
// 	entity := a.GetEntityByName(meta.META_ENTITY_NAME)
// 	s := service.New(ctx, a.Model.Graph)
// 	appData := s.QueryById(
// 		entity,
// 		//化成metaId
// 		a.AppId,
// 	)

// 	appMap := appData.(map[string]interface{})

// 	nextMeta := meta.MetaContent{}
// 	err := mapstructure.Decode(appMap[consts.META_CONTENT], &nextMeta)
// 	if err != nil {
// 		log.Println(err.Error())
// 	}
// 	oldMeta := meta.MetaContent{}
// 	err = mapstructure.Decode(appMap[consts.META_PUBLISHED_CONTENT], &oldMeta)
// 	if err != nil {
// 		log.Println(err.Error())
// 	}

// 	PublishMeta(a.MergeModel(&oldMeta), a.MergeModel(&nextMeta), a.AppId)

// 	appMap[consts.META_PUBLISHED_CONTENT] = appMap[consts.META_CONTENT]
// 	appMap["publishedAt"] = time.Now()
// 	instance := data.NewInstance(
// 		appMap,
// 		entity,
// 	)

// 	_, err = s.SaveOne(instance)

// 	if err != nil {
// 		log.Panic(err.Error())
// 	}

// 	ReLoadApp(a.AppId)
// }

func (a *App) MergeModel(content *meta.MetaContent) *meta.MetaContent {
	//后面改成合并Service
	//合并系统Schema
	// if a.AppId != meta.SYSTEM_APP_ID {
	// 	return MergeSystemModel(content)
	// }

	return content
}
