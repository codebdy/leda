package runner

import (
	"context"

	"codebdy.com/leda/services/schedule/entities"
	"github.com/codebdy/entify/model/observer"
	"github.com/codebdy/entify/shared"
	"github.com/mitchellh/mapstructure"
)

type ModelObserver struct {
	key string
}

func init() {
	//创建模型监听器
	modelObserver := &ModelObserver{
		key: "ModelObserverForSchedule",
	}
	observer.AddObserver(modelObserver)
}

func (o *ModelObserver) Key() string {
	return o.key
}

func (o *ModelObserver) ObjectPosted(object map[string]interface{}, entityName string, ctx context.Context) {
	defer shared.PrintErrorStack()
	if entityName == entities.TASK_NAME {
		var task entities.Task
		mapstructure.Decode(object, &task)
		TaskRunner.StartTask(&task)
	}
}
func (o *ModelObserver) ObjectMultiPosted(objects []map[string]interface{}, entityName string, ctx context.Context) {

}
func (o *ModelObserver) ObjectDeleted(object map[string]interface{}, entityName string, ctx context.Context) {
	defer shared.PrintErrorStack()
	if entityName == entities.TASK_NAME {
		var task entities.Task
		mapstructure.Decode(object, &task)
		TaskRunner.StopTask(task.Id)
	}
}
func (o *ModelObserver) ObjectMultiDeleted(objects []map[string]interface{}, entityName string, ctx context.Context) {

}
