package resolver

import (
	"context"
	"strconv"

	"codebdy.com/leda/services/schedule/runner"
)

func (*Resolver) CreateTask(id string, ctx context.Context) string {
	//runner.TaskRunner.StartTask()
	return "CreateTask !"
}

func (*Resolver) StartTask(id string, ctx context.Context) string {
	//runner.TaskRunner.StartTask()
	return "StartOneShotTask !"
}

func (*Resolver) StopTask(id string, ctx context.Context) string {
	numId, err := strconv.ParseInt(id, 10, 64)
	if err == nil {
		runner.TaskRunner.StopTask(numId)
	}

	return "cancelOneShotTask !"
}
