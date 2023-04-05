
package camunda

mutationFields[consts.DEPLOY_RPOCESS] = &graphql.Field{
	Type: graphql.ID,
	Args: graphql.FieldConfigArgument{
		consts.ID: &graphql.ArgumentConfig{
			Type: &graphql.NonNull{OfType: graphql.ID},
		},
	},
	Resolve: resolve.DeployProcessResolveFn(a.model),
}