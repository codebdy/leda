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
		startTask(id:ID!): String!
		#返回 status
		stopTask(id:ID!): String!
	}
`
