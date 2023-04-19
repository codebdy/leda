package app

import (
	"context"
	"log"
	"net/http"
	"sync"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/contexts"
	"codebdy.com/leda/services/models/entify/model/graph"
	"codebdy.com/leda/services/models/entify/model/meta"
	"codebdy.com/leda/services/models/modules/register"
	"codebdy.com/leda/services/models/service"
	"github.com/graphql-go/graphql"
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

	LoadServiceMetas()

	contextValues := contexts.Values(ctx)

	appId := contextValues.AppId
	appName := contextValues.AppName
	if appId == 0 && contextValues.AppName != "" {
		if id, ok := AppNames.Load(contextValues.AppName); ok {
			appId = id.(uint64)
		} else {
			systemApp := GetSystemApp()
			s := service.NewSystem()
			app := s.QueryOneEntity(systemApp.GetEntityByName(meta.APP_ENTITY_NAME), graph.QueryArg{
				consts.ARG_WHERE: graph.QueryArg{
					"name": graph.QueryArg{
						consts.ARG_EQ: appName,
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
