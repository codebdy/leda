package install

import (
	"os"
	"time"

	"codebdy.com/leda/services/models/consts"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/meta"
	"github.com/codebdy/entify/shared"
	"github.com/codebdy/leda-service-sdk/config"
	"github.com/codebdy/leda-service-sdk/system"
	"github.com/mitchellh/mapstructure"

	ledasdk "github.com/codebdy/leda-service-sdk"
)

const DEAULT_APP_SEED = "./seeds/default-app.json"

func init() {
	migrationOption := config.GetString(config.MIGRATION)
	if migrationOption == config.MIGRATION_SYNC {
		if !isInstalled() {
			installSystem()
		}
		syncDefaultApp()
	} else if migrationOption == config.MIGRATION_INSTALL {
		if !isInstalled() {
			installSystem()
			syncDefaultApp()
		}
	}
}

func installSystem() {
	defer shared.PrintErrorStack()
	rep := entify.New(config.GetDbConfig())
	nextMeta := system.SystemMeta
	rep.PublishMeta(&meta.UMLMeta{}, nextMeta, 0)

	rep.Init(*system.SystemMeta, 0)
}

func syncDefaultApp() {
	if !isDefaultAppSeedExist() {
		return
	}
	rep := entify.New(config.GetDbConfig())
	rep.Init(*system.SystemMeta, 0)
	appJson := ledasdk.ReadAppFromJson(DEAULT_APP_SEED)

	//查询已有app
	s, err := rep.OpenSession()
	if err != nil {
		panic(err)
	}
	app := s.QueryOne(consts.APP_ENTITY_NAME,
		graph.QueryArg{
			shared.ARG_WHERE: graph.QueryArg{
				"name": graph.QueryArg{
					shared.ARG_EQ: appJson.App.Name,
				},
			},
		},
	)
	oldContent := meta.UMLMeta{}
	//更新metaMap
	metaMap := map[string]interface{}{}
	if app != nil && app.(map[string]interface{})["metaId"] != 0 {
		metaId := app.(map[string]interface{})["metaId"].(uint64)
		if metaId != 0 {
			metaMap = s.QueryOneById(consts.META_ENTITY_NAME, metaId).(map[string]interface{})
			oldJson := metaMap["publishedContent"].(shared.JSON)
			mapstructure.Decode(oldJson, &oldContent)
		}
	}

	metaMap["content"] = appJson.Meta.Content
	metaMap["publishedContent"] = appJson.Meta.Content
	metaMap["publishedAt"] = time.Now()
	appMetaId, err := s.SaveOne(consts.META_ENTITY_NAME, metaMap)

	if err != nil {
		panic(err.Error())
	}

	//保存app
	appMap := map[string]interface{}{}
	if app != nil {
		appMap = app.(map[string]interface{})
	}

	appMap["name"] = appJson.App.Name
	appMap["title"] = appJson.App.Title
	appMap["metaId"] = appMetaId
	s.SaveOne(consts.APP_ENTITY_NAME, appMap)

	//发布AppMeta
	rep.PublishMeta(&oldContent, &appJson.Meta.Content, appMetaId)
}

func isDefaultAppSeedExist() bool {
	_, err := os.Stat(DEAULT_APP_SEED)
	if err == nil {
		return true
	}
	return false
}

func isInstalled() bool {
	rep := entify.New(config.GetDbConfig())
	return rep.IsEntityExists(consts.META_ENTITY_NAME)
}
