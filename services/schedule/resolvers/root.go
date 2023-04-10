package resolvers

type RootResolver struct{}

func(r *RootResolver) Query() *QueryResolver {
  return &QueryResolver{}
}

func(r *RootResolver) Mutation() *MutationResolver {
  return &MutationResolver{}
}

