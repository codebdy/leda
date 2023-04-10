package resolvers

type MutationResolver struct{}

func (*MutationResolver) Hello() string {
	return "Hello mutation!"
}