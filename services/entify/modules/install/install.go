package install

import (
	"log"
	"time"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/scalars"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/logs"
	"codebdy.com/leda/services/entify/model/data"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app"
	"codebdy.com/leda/services/entify/orm"
	"codebdy.com/leda/services/entify/service"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

type InstallArg struct {
	Admin    string     `json:"admin"`
	Password string     `json:"password"`
	WithDemo bool       `json:"withDemo"`
}

const INPUT = "input"

const (
	ADMIN         = "admin"
	ADMINPASSWORD = "password"
	WITHDEMO      = "withDemo"
)

var installInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "InstallInput",
		Fields: graphql.InputObjectConfigFieldMap{
			"meta": &graphql.InputObjectFieldConfig{
				Type: scalars.JSONType,
			},
			ADMIN: &graphql.InputObjectFieldConfig{
				Type: &graphql.NonNull{
					OfType: graphql.String,
				},
			},
			ADMINPASSWORD: &graphql.InputObjectFieldConfig{
				Type: &graphql.NonNull{
					OfType: graphql.String,
				},
			},
			WITHDEMO: &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
		},
	},
)

func installQueryFields() []*graphql.Field {
	return []*graphql.Field{
		{
			Name: consts.INSTALLED,
			Type: graphql.Boolean,
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer utils.PrintErrorStack()
				return app.Installed, nil
			},
		},
	}
}

func installMutationFields() []*graphql.Field {
	return []*graphql.Field{
		{
			Name: "install",
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				INPUT: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: installInputType,
					},
				},
			},
			Resolve: InstallResolve,
		},
	}
}

func InstallResolve(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()

	input := InstallArg{}
	mapstructure.Decode(p.Args[INPUT], &input)

	nextMeta := meta.SystemMeta
	app.PublishMeta(&meta.MetaContent{}, nextMeta, 0)

	systemApp := app.GetSystemApp()

	s := service.NewSystem()
	authMetaMp := authMetaMap()
	instance := data.NewInstance(
		authMetaMp,
		systemApp.GetEntityByName(meta.META_ENTITY_NAME),
	)
	//插入 Meta
	authMeta, err := s.InsertOne(instance)

	if err != nil || authMeta == nil {
		log.Panic(err.Error())
	}

	authMetaId := authMeta.(map[string]interface{})["id"].(uint64)
	instance = data.NewInstance(
		authServiceMap(authMetaId),
		systemApp.GetEntityByName(meta.SERVICE_ENTITY_NAME),
	)
	// 插入 Service
	authService, err := s.InsertOne(instance)
	if err != nil || authService == nil {
		log.Panic(err.Error())
	}
	authServiceId := authMeta.(map[string]interface{})["id"].(uint64)
	//把Service数据放入缓存
	app.ServiceMetas.Store(authServiceId, meta.DefualtAuthServiceMeta)

	nextMeta = meta.DefualtAuthServiceMeta
	app.PublishMeta(&meta.MetaContent{}, nextMeta, 0)
	app.LoadServiceMetas()
	systemApp.ReLoad()
	if input.Admin != "" {
		instance = data.NewInstance(
			adminInstance(input.Admin, input.Password),
			systemApp.GetEntityByName(meta.USER_ENTITY_NAME),
		)
		_, err = s.SaveOne(instance)
		if err != nil {
			logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.FAILURE, err.Error())
			return nil, err
		}
		if input.WithDemo {
			instance = data.NewInstance(
				demoInstance(),
				systemApp.GetEntityByName(meta.USER_ENTITY_NAME),
			)
			_, err = s.SaveOne(instance)
			if err != nil {
				logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.FAILURE, err.Error())
				return nil, err
			}
		}
	}
	isExist := orm.IsEntityExists(meta.META_ENTITY_NAME)
	logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.SUCCESS, "")
	app.Installed = true
	return isExist, nil
}

func authMetaMap() map[string]interface{} {

	return map[string]interface{}{
		consts.NAME:                   "authMeta",
		consts.META_CONTENT:           meta.DefualtAuthServiceMeta,
		consts.META_PUBLISHED_CONTENT: meta.DefualtAuthServiceMeta,
		consts.META_PUBLISHEDAT:       time.Now(),
		consts.META_CREATEDAT:         time.Now(),
		consts.META_UPDATEDAT:         time.Now(),
	}
}

func authServiceMap(metaId uint64) map[string]interface{} {

	return map[string]interface{}{
		consts.NAME:           "authService",
		"metaId":              metaId,
		"isSystem":            true,
		consts.META_CREATEDAT: time.Now(),
		consts.META_UPDATEDAT: time.Now(),
	}
}

func adminInstance(name string, password string) map[string]interface{} {
	return map[string]interface{}{
		consts.NAME:           "Admin",
		consts.LOGIN_NAME:     name,
		consts.PASSWORD:       password,
		consts.IS_SUPPER:      true,
		consts.META_CREATEDAT: time.Now(),
		consts.META_UPDATEDAT: time.Now(),
	}
}

func demoInstance() map[string]interface{} {
	return map[string]interface{}{
		consts.NAME:           "Demo",
		consts.LOGIN_NAME:     "demo",
		consts.PASSWORD:       "demo",
		consts.IS_DEMO:        true,
		consts.META_CREATEDAT: time.Now(),
		consts.META_UPDATEDAT: time.Now(),
	}
}
