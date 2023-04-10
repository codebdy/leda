package resolvers

type QueryResolver struct{}

func (*QueryResolver) Hello() string {
	return "Hello query!"
}
