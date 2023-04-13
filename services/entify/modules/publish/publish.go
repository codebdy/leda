package publish

import (
	"context"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/logs"
	"rxdrag.com/entify/modules/app"
	"rxdrag.com/entify/utils"
)

func PublishMetaResolveFn(app *app.App) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		doPublish(app, p.Context)
		logs.WriteBusinessLog(p.Context, logs.PUBLISH_META, logs.SUCCESS, "")
		return true, nil
	}
}

func doPublish(app *app.App, ctx context.Context) {
	app.Publish(ctx)
}
