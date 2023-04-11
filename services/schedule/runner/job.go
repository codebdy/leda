package runner

import "fmt"

type TestJob struct {
}

func (TestJob) Run() {
	fmt.Println("每5秒执行一次")
}
