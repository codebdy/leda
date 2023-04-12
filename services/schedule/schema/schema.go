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
		creatTask(config:TaskConfigInput!, start:bool):TaskConfig
		#返回 status
		startTask(id:ID!): String!
		#返回 status
		stopTask(id:ID!): String!
	}

	type TaskConfig{
		entityId:ID
		requestType: String!
		url: String
		gql: String
		params: JSON
	}

	type TaskConfigInput{
		entityId:ID
		requestType: String!
		url: String
		gql: String
		params: JSON
	}
`
