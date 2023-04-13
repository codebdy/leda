package app

import (
	"context"
	"log"
	"net/http"

	"codebdy.com/leda/services/entify/common/contexts"
	"codebdy.com/leda/services/entify/modules/register"
	"github.com/graphql-go/graphql"
)

type AppModule struct {
	app *App
}

func (m *AppModule) Init(ctx context.Context) {
	if contexts.Values(ctx).AppId == 0 {
		return
	}

	//没有安装
	if !Installed {
		return
	}

	app, err := Get(contexts.Values(ctx).AppId)
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
