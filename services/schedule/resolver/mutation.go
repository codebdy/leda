package resolver

import (
	"context"
)

func (*Resolver) HelloMutation(id ID, ctx context.Context) ID {
	//runner.TaskRunner.StartTask()
	return "HelloMutation !"
}

// func (*Resolver) StopTask(id ID, ctx context.Context) ID {
// 	numId, err := strconv.ParseInt(id, 10, 64)
// 	if err == nil {
// 		runner.TaskRunner.StopTask(numId)
// 	}

// 	return "cancelOneShotTask !"
// }
