package schema

import (
	"log"

	"codebdy.com/leda/services/schedule/global"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify-graphql-schema/schema"
	ledasdk "github.com/codebdy/leda-service-sdk"
	"github.com/codebdy/leda-service-sdk/config"
	"github.com/graphql-go/graphql"
)

func Load() {
	config := config.GetDbConfig()

	metaObj, err := ledasdk.GetServiceMata(global.SERVICE_NAME, config)

	if err != nil {
		panic(err.Error())
	}
	repo := entify.New(config)
	repo.Init(metaObj.PublishedContent, metaObj.Id)
	metaSchema := schema.New(repo)
	rootQuery := graphql.NewObject(graphql.ObjectConfig{
		Name:   "query",
		Fields: schema.ConvertArrayFields(metaSchema.QueryFields),
	})

	rootMutation := graphql.NewObject(graphql.ObjectConfig{
		Name:   "mutation",
		Fields: schema.ConvertArrayFields(metaSchema.MutationFields),
	})
	schemaConfig := graphql.SchemaConfig{
		Query:      rootQuery,
		Mutation:   rootMutation,
		Directives: metaSchema.Directives,
		Types:      metaSchema.Types,
	}

	schema, err := graphql.NewSchema(schemaConfig)

	if err != nil {
		log.Panic(err.Error())
	}

	global.ServiceSchema = &schema
}
