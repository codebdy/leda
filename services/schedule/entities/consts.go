package entities

const (
	ONE_SHOT_TASK_TYPE_FINISHED  string = "Finished"
	ONE_SHOT_TASK_TYPE_ERROR     string = "Error"
	PERIODIC_TASK_TYPE_NOT_START string = "NotStart"
	PERIODIC_TASK_TYPE_STOPED    string = "Stoped"
	PERIODIC_TASK_TYPE_RUNNING   string = "Running"
	PERIODIC_TASK_TYPE_PAUSED    string = "Paused"
	PERIODIC_TASK_TYPE_ERROR     string = "Error"

	REQUEST_TYPE_HTTP_GET         string = "HttpGet"
	REQUEST_TYPE_HTTP_POST        string = "HttpPOST"
	REQUEST_TYPE_GRAPHQL_QUERY    string = "GraphqlQuery"
	REQUEST_TYPE_GRAPHQL_MUTATION string = "GraphqlMutation"
)
