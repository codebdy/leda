package runner

import (
	"fmt"

	"github.com/robfig/cron"
)

func init() {
	c := cron.New()
	c.AddFunc("*/5 * * * * *", func() {
		fmt.Println("每5秒执行一次")
	})
	c.Start()
}

type TaskManager struct {
}
