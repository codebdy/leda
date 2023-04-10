package imexport

import (
	"context"
	"log"
	"net/http"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/common/contexts"
	"rxdrag.com/entify/modules/app"
	"rxdrag.com/entify/modules/register"
)

type ImExportModule struct {
	app *app.App
}

func (m *ImExportModule) Init(ctx context.Context) {
	if contexts.Values(ctx).AppId == 0 {
		return
	}

	//没有安装
	if !app.Installed {
		return
	}

	app, err := app.Get(contexts.Values(ctx).AppId)
	if err != nil {
		log.Panic(err.Error())
	}
	m.app = app
}

func (m *ImExportModule) SubscriptionFields() []*graphql.Field {
	return []*graphql.Field{}
}
func (m *ImExportModule) Directives() []*graphql.Directive {
	return []*graphql.Directive{}
}
func (m *ImExportModule) Types() []graphql.Type {
	return []graphql.Type{}
}
func (m *ImExportModule) Middlewares() []func(next http.Handler) http.Handler {
	return []func(next http.Handler) http.Handler{}
}

func init() {
	register.RegisterModule(&ImExportModule{})
}
