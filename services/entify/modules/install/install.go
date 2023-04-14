package install

import (
	"time"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/scalars"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/logs"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app"
	"codebdy.com/leda/services/entify/orm"
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
)

type InstallArg struct {
	Admin    string     `json:"admin"`
	Password string     `json:"password"`
	WithDemo bool       `json:"withDemo"`
	Meta     utils.JSON `json:"meta"`
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

	systemData := meta.SystemMeta
	input := InstallArg{}
	mapstructure.Decode(p.Args[INPUT], &input)

	if input.Meta != nil {
		systemData = input.Meta
	}

	nextMeta := systemData[consts.META_CONTENT].(meta.MetaContent)
	app.PublishMeta(&meta.MetaContent{}, &nextMeta, 0)

	//systemApp := app.GetSystemApp()

	// now := time.Now()
	// systemData["saveMetaAt"] = now
	// systemData["publishMetaAt"] = now
	// instance := data.NewInstance(
	// 	systemData,
	// 	systemApp.GetEntityByName(meta.APP_ENTITY_NAME),
	// )
	// s := service.NewSystem()
	// _, err := s.InsertOne(instance)

	// if err != nil {
	// 	log.Panic(err.Error())
	// }

	// systemApp, err = app.Get(meta.SYSTEM_APP_ID)

	// if err != nil {
	// 	log.Panic(err.Error())
	// }

	// if input.Admin != "" {
	// 	instance = data.NewInstance(
	// 		adminInstance(input.Admin, input.Password),
	// 		systemApp.GetEntityByName(meta.USER_ENTITY_NAME),
	// 	)
	// 	_, err = s.SaveOne(instance)
	// 	if err != nil {
	// 		logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.FAILURE, err.Error())
	// 		return nil, err
	// 	}
	// 	if input.WithDemo {
	// 		instance = data.NewInstance(
	// 			demoInstance(),
	// 			systemApp.GetEntityByName(meta.USER_ENTITY_NAME),
	// 		)
	// 		_, err = s.SaveOne(instance)
	// 		if err != nil {
	// 			logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.FAILURE, err.Error())
	// 			return nil, err
	// 		}
	// 	}
	// }
	isExist := orm.IsEntityExists(meta.META_ENTITY_NAME)
	logs.WriteBusinessLog(p.Context, logs.INSTALL, logs.SUCCESS, "")
	app.Installed = true
	return isExist, nil
}

func authServiceInstace() map[string]interface{} {
	return map[string]interface{}{
		consts.NAME:           "auth",
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
