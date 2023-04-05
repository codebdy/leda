package install

import (
	"context"
	"net/http"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/modules/app"
	"rxdrag.com/entify/modules/register"
)

type InstallModule struct {
}

func (m *InstallModule) Init(ctx context.Context) {
}
func (m *InstallModule) QueryFields() []*graphql.Field {
	return installQueryFields()
}
func (m *InstallModule) MutationFields() []*graphql.Field {
	if app.Installed {
		return []*graphql.Field{}
	} else {
		return installMutationFields()
	}
}
func (m *InstallModule) SubscriptionFields() []*graphql.Field {
	return []*graphql.Field{}
}
func (m *InstallModule) Directives() []*graphql.Directive {
	return []*graphql.Directive{}
}
func (m *InstallModule) Types() []graphql.Type {
	return []graphql.Type{}
}
func (m *InstallModule) Middlewares() []func(next http.Handler) http.Handler {
	return []func(next http.Handler) http.Handler{}
}

func init() {
	register.RegisterModule(&InstallModule{})
}
