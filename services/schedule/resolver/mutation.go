package resolver

import (
	"context"
	"strconv"

	"codebdy.com/leda/services/schedule/runner"
)

func (*Resolver) StartTask(id ID, ctx context.Context) ID {
	//runner.TaskRunner.StartTask()
	return "StartOneShotTask !"
}

func (*Resolver) StopTask(id ID, ctx context.Context) ID {
	numId, err := strconv.ParseInt(id, 10, 64)
	if err == nil {
		runner.TaskRunner.StopTask(numId)
	}

	return "cancelOneShotTask !"
}
