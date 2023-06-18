package runner

import (
	"fmt"

	"codebdy.com/leda/services/schedule/entities"
	"codebdy.com/leda/services/schedule/global"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/shared"
	"github.com/codebdy/leda-service-sdk/config"
	"github.com/mitchellh/mapstructure"
)

func Start() {
	fmt.Println("启动任务处理器")
	repo := entify.New(config.GetDbConfig())
	umlMeta := global.ServiceMeta.Content
	repo.Init(umlMeta, global.ServiceMeta.Id)
	session, err := repo.OpenSession()
	if err != nil {
		panic(err.Error())
	}

	data := session.Query(entities.TASK_NAME,
		graph.QueryArg{
			shared.ARG_WHERE: graph.QueryArg{
				"status": graph.QueryArg{
					shared.ARG_EQ: entities.TASK_STATUS_RUNNING,
				},
			},
		},
		[]string{"id", "name", "cronExpression", "config", "status"},
	)

	for node := range data.Nodes {
		task := entities.Task{}
		mapstructure.Decode(node, &task)
		TaskRunner.StartTask(&task)
	}
}

func Run() {
	go Start()
}
