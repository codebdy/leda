package snapshot

import (
	"context"
	"log"
	"net/http"

	"codebdy.com/leda/services/entify/contexts"
	"codebdy.com/leda/services/entify/modules/app"
	"codebdy.com/leda/services/entify/modules/register"
	"github.com/graphql-go/graphql"
)

type SnapshotModule struct {
	app *app.App
}

func (m *SnapshotModule) Init(ctx context.Context) {
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
func (m *SnapshotModule) QueryFields() []*graphql.Field {
	return []*graphql.Field{}
}

func (m *SnapshotModule) SubscriptionFields() []*graphql.Field {
	return []*graphql.Field{}
}
func (m *SnapshotModule) Directives() []*graphql.Directive {
	return []*graphql.Directive{}
}
func (m *SnapshotModule) Types() []graphql.Type {
	return []graphql.Type{}
}
func (m *SnapshotModule) Middlewares() []func(next http.Handler) http.Handler {
	return []func(next http.Handler) http.Handler{}
}

func init() {
	register.RegisterModule(&SnapshotModule{})
}
