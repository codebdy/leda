package install

import (
	"os"
	"time"

	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/meta"
	"github.com/codebdy/entify/shared"
	"github.com/codebdy/leda-service-sdk/config"
	"github.com/codebdy/leda-service-sdk/consts"
	"github.com/codebdy/leda-service-sdk/system"
	"github.com/goinggo/mapstructure"

	ledasdk "github.com/codebdy/leda-service-sdk"
)

const MODEL_SEED = "./seeds/model.json"

func init() {
	migrationOption := config.GetString(config.MIGRATION)
	if migrationOption == config.MIGRATION_SYNC || migrationOption == config.MIGRATION_INSTALL {
		updateServiceModel(migrationOption == config.MIGRATION_SYNC)
	}
}

func updateServiceModel(isSync bool) {
	if !isServiceModelSeedExist() {
		return
	}
	rep := entify.New(config.GetDbConfig())
	rep.Init(*system.SystemMeta, 0)
	serviceJson := ledasdk.ReadServiceFromJson(MODEL_SEED)

	//查询已有Service
	s, err := rep.OpenSession()
	if err != nil {
		panic(err)
	}
	serviceObj := s.QueryOne(consts.SERVICE_ENTITY_NAME,
		graph.QueryArg{
			shared.ARG_WHERE: graph.QueryArg{
				"name": graph.QueryArg{
					shared.ARG_EQ: serviceJson.Service.Name,
				},
			},
		},
	)
	//发布ServicepMeta
	oldContent := meta.UMLMeta{}
	//如果不是强制同步，并且service已经存在，则跳出
	if serviceObj != nil && !isSync {
		return
	}
	//更新metaMap
	metaMap := map[string]interface{}{}
	if serviceObj != nil && serviceObj.(map[string]interface{})["metaId"] != 0 {
		metaId := serviceObj.(map[string]interface{})["metaId"].(uint64)
		if metaId != 0 {
			metaMap = s.QueryOneById(consts.META_ENTITY_NAME, metaId).(map[string]interface{})
			oldJson := metaMap["publishedContent"].(shared.JSON)
			mapstructure.Decode(oldJson, &oldContent)
		}
	}

	metaMap["content"] = serviceJson.Meta.Content
	metaMap["publishedContent"] = serviceJson.Meta.Content
	metaMap["publishedAt"] = time.Now()
	serviceMetaId, err := s.SaveOne(consts.META_ENTITY_NAME, metaMap)

	if err != nil {
		panic(err.Error())
	}

	//保存service
	serviceMap := map[string]interface{}{}
	if serviceObj != nil {
		serviceMap = serviceObj.(map[string]interface{})
	}

	serviceMap["name"] = serviceJson.Service.Name
	serviceMap["title"] = serviceJson.Service.Title
	serviceMap["metaId"] = serviceMetaId
	s.SaveOne(consts.SERVICE_ENTITY_NAME, serviceMap)

	rep.PublishMeta(&oldContent, &serviceJson.Meta.Content, serviceMetaId)
}

func isServiceModelSeedExist() bool {
	_, err := os.Stat(MODEL_SEED)
	if err == nil {
		return true
	}
	return false
}
