package logs

import (
	"context"

	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/observer"
)

type ModelObserver struct {
	key string
}

func init() {
	//创建模型监听器
	modelObserver := &ModelObserver{
		key: "ModelObserverForLogs",
	}
	observer.AddObserver(modelObserver)
}

func (o *ModelObserver) Key() string {
	return o.key
}

func (o *ModelObserver) ObjectPosted(object map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	WriteModelLog(&entity.Class, ctx, UPSERT, SUCCESS, ctx.Value("gql"))
}

func (o *ModelObserver) ObjectMultiPosted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	WriteModelLog(&entity.Class, ctx, MULTI_UPSERT, SUCCESS, ctx.Value("gql"))
}
func (o *ModelObserver) ObjectDeleted(object map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	WriteModelLog(&entity.Class, ctx, DELETE, SUCCESS, ctx.Value("gql"))
}

func (o *ModelObserver) ObjectMultiDeleted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	WriteModelLog(&entity.Class, ctx, MULTI_DELETE, SUCCESS, ctx.Value("gql"))
}
