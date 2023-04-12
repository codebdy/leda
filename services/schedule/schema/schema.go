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
		creatTask(config:TaskInput!):Task
		#返回 status
		startTask(id:ID!): String!
		#返回 status
		stopTask(id:ID!): String!
	}

	type Task{

	}

	type TaskInput{

	}

	type TaskConfig{
		requestType: String!
		url: String
		gql: String
		params: JSON
	}

	type TaskConfigInput{
		requestType: String!
		url: String
		gql: String
		params: JSON
	}
`
