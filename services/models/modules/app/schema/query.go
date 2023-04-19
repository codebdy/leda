package schema

import (
	"codebdy.com/leda/services/models/model/graph"
	"codebdy.com/leda/services/models/modules/app/resolve"
	"github.com/graphql-go/graphql"
)

func (a *AppProcessor) QueryFields() []*graphql.Field {
	queryFields := graphql.Fields{}

	for _, entity := range a.Model.Graph.RootEnities() {
		a.appendEntityToQueryFields(entity, queryFields)
	}
	return convertFieldsArray(queryFields)
}

func (a *AppProcessor) EntityQueryResponseType(entity *graph.Entity) graphql.Output {
	return a.modelParser.EntityListType(entity)
}
func (a *AppProcessor) ClassQueryResponseType(cls *graph.Class) graphql.Output {
	return a.modelParser.ClassListType(cls)
}

func (a *AppProcessor) appendEntityToQueryFields(entity *graph.Entity, fields graphql.Fields) {
	(fields)[entity.QueryName()] = &graphql.Field{
		Type:    a.EntityQueryResponseType(entity),
		Args:    a.modelParser.QueryArgs(entity.Name()),
		Resolve: resolve.QueryEntityResolveFn(entity, a.Model),
	}
	(fields)[entity.QueryOneName()] = &graphql.Field{
		Type:    a.modelParser.OutputType(entity.Name()),
		Args:    a.modelParser.QueryArgs(entity.Name()),
		Resolve: resolve.QueryOneEntityResolveFn(entity, a.Model),
	}

}
