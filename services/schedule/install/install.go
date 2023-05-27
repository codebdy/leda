package install

import (
	"os"

	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/meta"
	"github.com/codebdy/entify/shared"
	"github.com/codebdy/leda-service-sdk/config"
	"github.com/codebdy/leda-service-sdk/consts"
	"github.com/codebdy/leda-service-sdk/system"

	ledasdk "github.com/codebdy/leda-service-sdk"
)

const MODEL_SEED = "./seeds/model.json"

func init() {
	migrationOption := config.GetString(config.MIGRATION)
	if migrationOption == config.MIGRATION_SYNC || migrationOption == config.MIGRATION_INSTALL {
		syncServiceModel()
	}
}

func syncServiceModel() {
	if !isServiceModelSeedExist() {
		return
	}
	rep := entify.New(config.GetDbConfig())
	rep.Init(*system.SystemMeta, 0)
	serviceJson := ledasdk.ReadAppFromJson(MODEL_SEED)

	//查询已有Service
	s, err := rep.OpenSession()
	if err != nil {
		panic(err)
	}
	serviceObj := s.QueryOne(consts.SERVICE_ENTITY_NAME,
		graph.QueryArg{
			shared.ARG_WHERE: graph.QueryArg{
				"name": graph.QueryArg{
					shared.ARG_EQ: serviceJson.App.Name,
				},
			},
		},
	)
	//更新metaObj
	metaObj := map[string]interface{}{}
	if serviceObj != nil && serviceObj.(map[string]interface{})["metaId"] != 0 {
		metaId := serviceObj.(map[string]interface{})["metaId"].(uint64)
		if metaId != 0 {
			metaObj = s.QueryOneById(consts.META_ENTITY_NAME, metaId).(map[string]interface{})
		}
	}

	metaObj["content"] = serviceJson.Meta.Content
	appMetaId, err := s.SaveOne(consts.META_ENTITY_NAME, metaObj)

	if err != nil {
		panic(err.Error())
	}

	//保存app
	serviceMap := map[string]interface{}{}
	if serviceObj != nil {
		serviceMap = serviceObj.(map[string]interface{})
	}

	serviceMap["name"] = serviceJson.App.Name
	serviceMap["title"] = serviceJson.App.Title
	serviceMap["metaId"] = appMetaId
	s.SaveOne(consts.SERVICE_ENTITY_NAME, serviceMap)

	//发布AppMeta
	oldContent := meta.UMLMeta{}
	if metaObj["nextContent"] != nil {
		oldContent = metaObj["nextContent"].(meta.UMLMeta)
	}

	rep.PublishMeta(&oldContent, &serviceJson.Meta.Content, appMetaId)
}

func isServiceModelSeedExist() bool {
	_, err := os.Stat(MODEL_SEED)
	if err == nil {
		return true
	}
	return false
}
