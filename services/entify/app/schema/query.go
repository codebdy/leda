package schema

import (
	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app/resolve"
	"github.com/graphql-go/graphql"
)

func (a *AppProcessor) QueryFields() []*graphql.Field {
	queryFields := graphql.Fields{}

	for _, entity := range a.Model.Graph.RootEnities() {
		a.appendEntityToQueryFields(entity, queryFields)
	}
	// for _, third := range a.Model.Graph.ThirdParties {
	// 	a.appendThirdPartyToQueryFields(third, queryFields)
	// }

	for _, orchestration := range a.Model.Meta.Orchestrations {
		if orchestration.OperateType == consts.QUERY {
			a.appendOrchestrationToQueryFields(orchestration, queryFields)
		}
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

// func (a *AppProcessor) appendThirdPartyToQueryFields(third *graph.ThirdParty, fields graphql.Fields) {
// 	(fields)[third.QueryName()] = &graphql.Field{
// 		Type:    a.ClassQueryResponseType(&third.Class),
// 		Args:    a.modelParser.QueryArgs(third.Name()),
// 		Resolve: resolve.QueryThirdPartyResolveFn(third, a.Model),
// 	}
// 	(fields)[third.QueryOneName()] = &graphql.Field{
// 		Type:    a.modelParser.OutputType(third.Name()),
// 		Args:    a.modelParser.QueryArgs(third.Name()),
// 		Resolve: resolve.QueryOneThirdPartyResolveFn(third, a.Model),
// 	}

// }

func (a *AppProcessor) appendOrchestrationToQueryFields(orchestration *meta.OrchestrationMeta, fields graphql.Fields) {
	fields[orchestration.Name] = &graphql.Field{
		Type:        a.modelParser.OrchestrationType(orchestration),
		Args:        a.modelParser.MethodArgs(orchestration.Args),
		Description: orchestration.Description,
		Resolve:     resolve.MethodResolveFn(orchestration.Script, orchestration.Args, a.Model),
	}
}
