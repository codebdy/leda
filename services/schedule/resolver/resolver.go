package resolver

type Resolver struct{}

func (*Resolver) Hello() string {
	return "Hello query!"
}
