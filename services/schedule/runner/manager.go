package runner

import (
	"sync"

	"codebdy.com/leda/services/schedule/entities"
	"github.com/codebdy/entify/shared"
	"github.com/robfig/cron"
)

// func init() {
// 	c := cron.New()
// 	c.AddFunc("*/5 * * * * *", func() {
// 		fmt.Println("只执行一次")
// 		fmt.Printf("2 c.Entries(): %v\n", c.Entries())
// 	})
// 	fmt.Printf("1 c.Entries(): %v\n", c.Entries())
// 	c.Start()
// }
var TaskRunner *TaskManager = &TaskManager{}

type TaskManager struct {
	crons sync.Map
}

func (t *TaskManager) StartTask(task *entities.Task) {
	defer shared.PrintErrorStack()
	c := cron.New()
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
