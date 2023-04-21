package app

import (
	"context"
	"log"
	"net/http"
	"sync"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/contexts"
	"codebdy.com/leda/services/models/modules/register"
	"github.com/codebdy/entify-graphql-schema/service"
	"github.com/codebdy/entify/model/graph"
	"github.com/graphql-go/graphql"

	schemaConsts "github.com/codebdy/entify-graphql-schema/consts"
)

var AppNames sync.Map

type AppModule struct {
	app *App
}

func (m *AppModule) Init(ctx context.Context) {
	//没有安装
	if !Installed {
		return
	}

	contextValues := contexts.Values(ctx)
	systemApp := GetSystemApp()
	appId := contextValues.AppId
	appName := contextValues.AppName
	if appId == 0 && contextValues.AppName != "" {
		if id, ok := AppNames.Load(contextValues.AppName); ok {
			appId = id.(uint64)
		} else {

			s := service.NewSystem(systemApp.Repo)
			app := s.QueryOneEntity(consts.APP_ENTITY_NAME, graph.QueryArg{
				schemaConsts.ARG_WHERE: graph.QueryArg{
					"name": graph.QueryArg{
						schemaConsts.ARG_EQ: appName,
					},
				},
			})

			if app != nil {
				appId = app.(map[string]interface{})["id"].(uint64)
				AppNames.Store(appName, appId)
			} else {
				log.Panic("Can not find app")
			}
		}
	}
	app, err := Get(appId)
	if err != nil {
		log.Panic(err.Error())
	}
	m.app = app
}

func (m *AppModule) QueryFields() []*graphql.Field {

	if m.app != nil {
		return m.app.Schema.QueryFields
	} else {
		return []*graphql.Field{}
	}
}
func (m *AppModule) MutationFields() []*graphql.Field {
	if m.app != nil {
		return m.app.Schema.MutationFields
	} else {
		return []*graphql.Field{}
	}
}

func (m *AppModule) Directives() []*graphql.Directive {
	if m.app != nil {
		return m.app.Schema.Directives
	} else {
		return []*graphql.Directive{}
	}
}
func (m *AppModule) Types() []graphql.Type {
	if m.app != nil {
		return m.app.Schema.Types
	} else {
		return []graphql.Type{}
	}
}
func (m *AppModule) Middlewares() []func(next http.Handler) http.Handler {
	return []func(next http.Handler) http.Handler{
		LoadersMiddleware,
	}
}

func init() {
	register.RegisterModule(&AppModule{})
}
