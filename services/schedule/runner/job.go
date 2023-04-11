package runner

import (
	"fmt"

	"codebdy.com/leda/services/schedule/entities"
)

type OneShotJob struct {
	Task *entities.OneShotTask
}

func (OneShotJob) Run() {
	fmt.Println("每5秒执行一次")
}
