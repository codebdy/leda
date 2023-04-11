package resolver

import (
	"context"
	"strconv"

	"codebdy.com/leda/services/schedule/runner"
)

func (*Resolver) StartTask(ctx context.Context, args struct {
	ID string
}) string {
	//runner.TaskRunner.StartTask()
	return "StartOneShotTask !"
}

func (*Resolver) StopTask(ctx context.Context, args struct {
	ID string
}) string {
	id, err := strconv.ParseInt(args.ID, 10, 64)
	if err == nil {
		runner.TaskRunner.StopTask(id)
	}

	return "cancelOneShotTask !"
}
