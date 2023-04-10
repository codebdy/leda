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
		#返回 status
		startOneShotTask(id:ID!): String!
		#返回 status
		startPeriodicTask(id:ID!): String!
	}
`
