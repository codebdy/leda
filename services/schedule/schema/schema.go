package schema

import (
	"github.com/graphql-go/graphql"
	"rxdrag.com/entify-schema-registry/consts"
)

var serviceType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: "Service",
		Fields: graphql.Fields{
			consts.ID: &graphql.Field{
				Type: &graphql.NonNull{
					OfType: graphql.Int,
				},
			},
			consts.NAME: &graphql.Field{
				Type: graphql.String,
			},
			consts.URL: &graphql.Field{
				Type: graphql.String,
			},
			consts.SERVICETYPE: &graphql.Field{
				Type: graphql.String,
			},
			consts.TYPE_DEFS: &graphql.Field{
				Type: graphql.String,
			},
			consts.IS_ALIVE: &graphql.Field{
				Type: graphql.Boolean,
			},
			consts.VERSION: &graphql.Field{
				Type: graphql.String,
			},
			consts.ADDED_TIME: &graphql.Field{
				Type: graphql.DateTime,
			},
			consts.UPDATED_TIME: &graphql.Field{
				Type: graphql.DateTime,
			},
		},
		Description: "Service type",
	},
)

func CreateSchema() (graphql.Schema, error) {
	rootQuery := graphql.ObjectConfig{Name: "Query", Fields: queryFields()}
	rootMutation := graphql.ObjectConfig{Name: "Mutation", Fields: mutationFields()}
	schemaConfig := graphql.SchemaConfig{
		Query:    graphql.NewObject(rootQuery),
		Mutation: graphql.NewObject(rootMutation),
	}
	return graphql.NewSchema(schemaConfig)
}
