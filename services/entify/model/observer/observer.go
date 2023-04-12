package observer

import (
	"context"
	"sync"

	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/observer/consts"
)

type ModelObserver interface {
	Key() string
	ObjectPosted(object map[string]interface{}, entity *graph.Entity, ctx context.Context)
	ObjectMultiPosted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context)
	ObjectDeleted(object map[string]interface{}, entity *graph.Entity, ctx context.Context)
	ObjectMultiDeleted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context)
}

var ModelObservers sync.Map

func AddObserver(obsr ModelObserver) {
	ModelObservers.Store(obsr.Key(), obsr)
}

func RemoveObserver(key string) {
	ModelObservers.Delete(key)
}

func EmitObjectPosted(object map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	newCtx := context.WithValue(context.Background(), consts.CONTEXT_VALUES, contexts.Values(ctx))
	newCtx = context.WithValue(newCtx, consts.LOADERS, ctx.Value(consts.LOADERS))
	go func() {
		ModelObservers.Range(func(key interface{}, value interface{}) bool {
			value.(ModelObserver).ObjectPosted(object, entity, newCtx)
			return true
		})
	}()
}

func EmitObjectMultiPosted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	go func() {
		ModelObservers.Range(func(key interface{}, value interface{}) bool {
			value.(ModelObserver).ObjectMultiPosted(objects, entity, ctx)
			return true
		})
	}()
}

func EmitObjectDeleted(object map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	go func() {
		ModelObservers.Range(func(key interface{}, value interface{}) bool {
			value.(ModelObserver).ObjectDeleted(object, entity, ctx)
			return true
		})
	}()
}

func EmitObjectMultiDeleted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	go func() {
		ModelObservers.Range(func(key interface{}, value interface{}) bool {
			value.(ModelObserver).ObjectMultiDeleted(objects, entity, ctx)
			return true
		})
	}()
}
