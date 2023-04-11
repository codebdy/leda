package runner

import (
	"fmt"
	"sync"

	"codebdy.com/leda/services/schedule/entities"
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
	oneShotTasks  sync.Map
	periodicTasks sync.Map
}

func (t *TaskManager) StartOneShotTask(task *entities.OneShotTask) {
	c := cron.New()
	c.AddJob(task.CronExpression, OneShotJob{Task: task})
	t.oneShotTasks.Store(task.Id, c)
	c.Start()
}

func (t *TaskManager) CancelOneShotTask(taskId int64) {
	c, ok := t.oneShotTasks.Load(taskId)
	if ok {
		(c.(*cron.Cron)).Stop()
		t.oneShotTasks.Delete(taskId)
	}
}
