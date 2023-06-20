package runner

import (
	"codebdy.com/leda/services/schedule/entities"
)

type Job struct {
	task *entities.Task
}

func (j Job) Run() {
	if j.task.Config.RequestType == entities.REQUEST_TYPE_GRAPHQL {
		excuteGraphqlTask(*j.task)
	} else if j.task.Config.RequestType == entities.REQUEST_TYPE_HTTP_GET {
		panic("Not implement")
	} else if j.task.Config.RequestType == entities.REQUEST_TYPE_HTTP_POST {
		panic("Not implement")
	}
}
