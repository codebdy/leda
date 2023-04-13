package publish

import (
	"context"

	"codebdy.com/leda/services/entify/logs"
	"codebdy.com/leda/services/entify/modules/app"
	"codebdy.com/leda/services/entify/utils"
	"github.com/graphql-go/graphql"
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
