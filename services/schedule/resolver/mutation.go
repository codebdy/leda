package resolver

import (
	"strconv"

	"codebdy.com/leda/services/schedule/runner"
	"github.com/graphql-go/graphql"
)

func (*Resolver) CreateTask(p graphql.ResolveParams) string {
	//runner.TaskRunner.StartTask()
	return "CreateTask !"
}

func (*Resolver) StartTask(p graphql.ResolveParams) string {
	//runner.TaskRunner.StartTask()
	return "StartOneShotTask !"
}

func (*Resolver) StopTask(p graphql.ResolveParams) string {
	id, err := strconv.ParseInt(p.Args["id"].(string), 10, 64)
	if err == nil {
		runner.TaskRunner.StopTask(id)
	}

	return "cancelOneShotTask !"
}
