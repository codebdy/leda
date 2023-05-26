package install

import (
	"log"
	"time"

	"codebdy.com/leda/services/models/config"
	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/logs"
	"codebdy.com/leda/services/models/modules/app"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify-graphql-schema/scalars"
	"github.com/codebdy/entify/model/meta"
	"github.com/codebdy/entify/shared"
	ledasdk "github.com/codebdy/leda-service-sdk"
	"github.com/codebdy/leda-service-sdk/system"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

type InstallArg struct {
	Admin    string `json:"admin"`
	Password string `json:"password"`
	WithDemo bool   `json:"withDemo"`
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
				defer shared.PrintErrorStack()
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

func loadAuthMeta() *meta.UMLMeta {

	authContent := ledasdk.ReadContentFromJson("./seeds/auth-meta.json")
	return &authContent
}

func InstallResolve(p graphql.ResolveParams) (interface{}, error) {
	defer shared.PrintErrorStack()
	rep := entify.New(config.GetDbConfig())

	input := InstallArg{}
	mapstructure.Decode(p.Args[INPUT], &input)

	nextMeta := system.SystemMeta
	rep.PublishMeta(&meta.UMLMeta{}, nextMeta, 0)

	rep.Init(*system.SystemMeta, 0)
	s, err := rep.OpenSession()
	if err != nil {
		panic(err.Error())
	}
	authUmlMeta := loadAuthMeta()
	authMetaMp := authMetaMap(authUmlMeta)

	//插入 Meta
	authMetaId, err := s.SaveOne(consts.META_ENTITY_NAME, authMetaMp)

	if err != nil || authMetaId == 0 {
		log.Panic(err.Error())
	}

	// 插入 Service
	authServiceId, err := s.SaveOne(consts.SERVICE_ENTITY_NAME, authServiceMap(authMetaId))
	if err != nil || authServiceId == 0 {
		log.Panic(err.Error())
	}
	nextMeta = authUmlMeta
	rep.PublishMeta(&meta.UMLMeta{}, nextMeta, 0)
	//app.LoadServiceMetas()

	//@@ 这个安装移动到权限认证模块
	// if input.Admin != "" {
	// 	_, err = s.SaveOne(consts.USER_ENTITY_NAME, adminInstance(input.Admin, input.Password))
	// 	if err != nil {
	// 		logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.FAILURE, err.Error())
	// 		return nil, err
	// 	}
	// 	if input.WithDemo {
	// 		_, err = s.SaveOne(consts.USER_ENTITY_NAME, demoInstance())
	// 		if err != nil {
	// 			logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.FAILURE, err.Error())
	// 			return nil, err
	// 		}
	// 	}
	// }
	isExist := rep.IsEntityExists(consts.META_ENTITY_NAME)
	logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.SUCCESS, "")
	app.Installed = true
	return isExist, nil
}

func authMetaMap(authMeta *meta.UMLMeta) map[string]interface{} {

	return map[string]interface{}{
		consts.NAME:                   "authMeta",
		consts.META_CONTENT:           authMeta,
		consts.META_PUBLISHED_CONTENT: authMeta,
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
