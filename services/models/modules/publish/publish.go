package publish

import (
	"log"
	"strconv"
	"time"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/leda-shared/utils"
	"codebdy.com/leda/services/models/logs"
	"codebdy.com/leda/services/models/modules/app"
	"codebdy.com/leda/services/models/service"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/meta"
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

	metaData := s.QueryById(consts.META_ENTITY_NAME, metaId)

	//获取所属APP
	appData := s.QueryOneEntity(consts.APP_ENTITY_NAME, graph.QueryArg{
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

	publishedMeta := meta.UMLMeta{}

	if metaMap[consts.META_PUBLISHED_CONTENT] != nil {
		err := mapstructure.Decode(metaMap[consts.META_PUBLISHED_CONTENT], &publishedMeta)
		if err != nil {
			panic(err.Error())
		}
	}
	nextMeta := meta.UMLMeta{}
	err := mapstructure.Decode(metaMap[consts.META_CONTENT], &nextMeta)
	if err != nil {
		log.Println(err.Error())
	}
	systemApp.Repo.PublishMeta(&publishedMeta, &nextMeta, appId)

	metaMap[consts.META_PUBLISHED_CONTENT] = metaMap[consts.META_CONTENT]
	metaMap[consts.META_PUBLISHEDAT] = time.Now()
	metaMap[consts.META_CREATEDAT] = time.Now()
	metaMap[consts.META_UPDATEDAT] = time.Now()

	//插入 Meta
	_, err = s.SaveOne(consts.META_ENTITY_NAME, metaMap)
	if err != nil {
		panic(err.Error())
	}

	//如果是service
	if appId == 0 {
		app.LoadServiceMetas()
	}
	//如果是app
	if appId != 0 {
		app.ReloadApp(appId)
	}
}
