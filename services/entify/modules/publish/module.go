package publish

import (
	"context"
	"log"
	"net/http"

	"codebdy.com/leda/services/entify/contexts"
	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/modules/app"
	"codebdy.com/leda/services/entify/modules/register"
	"github.com/graphql-go/graphql"
)

type PublishModule struct {
	app *app.App
}

func (m *PublishModule) Init(ctx context.Context) {
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
func (m *PublishModule) QueryFields() []*graphql.Field {
	return []*graphql.Field{}
}
func (m *PublishModule) MutationFields() []*graphql.Field {
	if m.app != nil {
		return []*graphql.Field{
			{
				Name: consts.PUBLISH,
				Type: graphql.Boolean,
				Args: graphql.FieldConfigArgument{
					consts.APPID: &graphql.ArgumentConfig{
						Type: &graphql.NonNull{OfType: graphql.ID},
					},
				},
				Resolve: PublishMetaResolveFn(m.app),
			},
		}
	} else {
		return []*graphql.Field{}
	}
}
func (m *PublishModule) SubscriptionFields() []*graphql.Field {
	return []*graphql.Field{}
}
func (m *PublishModule) Directives() []*graphql.Directive {
	return []*graphql.Directive{}
}
func (m *PublishModule) Types() []graphql.Type {
	return []graphql.Type{}
}
func (m *PublishModule) Middlewares() []func(next http.Handler) http.Handler {
	return []func(next http.Handler) http.Handler{}
}

func init() {
	register.RegisterModule(&PublishModule{})
}
