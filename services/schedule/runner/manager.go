package runner

import (
	"sync"

	"codebdy.com/leda/services/schedule/entities"
	"github.com/codebdy/entify/shared"
	"github.com/robfig/cron/v3"
)

var TaskRunner *TaskManager = &TaskManager{}

type TaskManager struct {
	crons sync.Map
}

func (t *TaskManager) StartTask(task *entities.Task) {
	defer shared.PrintErrorStack()
	t.StopTask(task.Id)
	c := cron.New(cron.WithSeconds())
	c.AddJob(task.CronExpression, Job{task: task})
	t.crons.Store(task.Id, c)
	c.Start()
}

func (t *TaskManager) StopTask(taskId int64) {
	defer shared.PrintErrorStack()
	c, ok := t.crons.Load(taskId)
	if ok {
		(c.(*cron.Cron)).Stop()
		t.crons.Delete(taskId)
	}
}

func (t *TaskManager) Destory() {
	defer shared.PrintErrorStack()
	t.crons.Range(func(key interface{}, value interface{}) bool {
		c, ok := t.crons.LoadAndDelete(key)
		if ok {
			(c.(*cron.Cron)).Stop()
		}
		return true
	})
}
