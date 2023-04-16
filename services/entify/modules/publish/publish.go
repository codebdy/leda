package publish

import (
	"log"
	"strconv"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/logs"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app"
	"codebdy.com/leda/services/entify/service"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

func PublishMetaResolveFn(theApp *app.App) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		strId := p.Args[consts.METAID]
		publishMeta(strId)
		logs.WriteBusinessLog(p.Context, logs.PUBLISH_META, logs.SUCCESS, "")
		return true, nil
	}
}

func publishMeta(strId interface{}) {
	if strId == nil || strId == "" {
		panic("Not provide metaId")
	}

	intNum, _ := strconv.Atoi(strId.(string))
	metaId := uint64(intNum)
	s := service.NewSystem()

	systemApp := app.GetSystemApp()

	metaData := s.QueryById(systemApp.GetEntityByName(meta.META_ENTITY_NAME), metaId)

	//获取所属APP
	appData := s.QueryOneEntity(systemApp.GetEntityByName(meta.APP_ENTITY_NAME), graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			consts.METAID: graph.QueryArg{
				consts.ARG_EQ: metaId,
			},
		},
	})

	var appId uint64

	if appData != nil {
		appId = appData.(map[string]interface{})[consts.ID].(uint64)
	}

	if metaData == nil {
		panic("can not find meta by id: " + strId.(string))
	}

	metaMap := metaData.(map[string]interface{})

	publishedMeta := meta.MetaContent{}

	if metaMap[consts.META_PUBLISHED_CONTENT] != nil {
		err := mapstructure.Decode(metaMap[consts.META_PUBLISHED_CONTENT], &publishedMeta)
		if err != nil {
			log.Println(err.Error())
		}
	}
	nextMeta := meta.MetaContent{}
	err := mapstructure.Decode(metaMap[consts.META_CONTENT], &nextMeta)
	if err != nil {
		log.Println(err.Error())
	}
	app.PublishMeta(&publishedMeta, &nextMeta, appId)

	//如果是service
	if appId == 0 {

	}
	//如果是app
	if appId != 0 {

	}
}
