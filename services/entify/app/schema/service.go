package schema

import (
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"github.com/graphql-go/graphql"
)

func appendServiceQueryFields(exClass *graph.Entity, fields graphql.Fields) {
	methods := exClass.MethodsByType(meta.QUERY)
	if len(methods) > 0 {
		(fields)[exClass.QueryName()] = &graphql.Field{
			Type: graphql.String,
			//Resolve: resolve.QueryResolveFn(node),
		}
	}

}

func appendServiceMutationFields(serviceClass *graph.Entity, fields graphql.Fields) {
	methods := serviceClass.MethodsByType(meta.MUTATION)
	if len(methods) > 0 {
		(fields)[utils.FirstLower(serviceClass.Name())] = &graphql.Field{
			Type: graphql.String,
			//Resolve: resolve.QueryResolveFn(node),
		}
	}
}
