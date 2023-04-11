package runner

import (
	"fmt"

	"codebdy.com/leda/services/schedule/entities"
)

type Job struct {
	task *entities.Task
}

func (Job) Run() {
	fmt.Println("执行任务")
}
