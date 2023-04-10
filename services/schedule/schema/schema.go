package schema

var SDL = `
	schema {
		query: Query
		mutation: Mutation
	}

	type Query {
		hello: String!
	}

	type Mutation {
		hello2: String!
	}
`
