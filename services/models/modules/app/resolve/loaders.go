package resolve

import (
	"context"
	"fmt"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/contexts"
	"codebdy.com/leda/services/models/leda-shared/utils"
	"codebdy.com/leda/services/models/model"
	"codebdy.com/leda/services/models/model/graph"
	"codebdy.com/leda/services/models/service"
	"github.com/graph-gophers/dataloader"
	"github.com/graphql-go/graphql"
)

type ResolverKey struct {
	id uint64
}

func NewKey(id uint64) *ResolverKey {
	return &ResolverKey{
		id: id,
	}
}

func (rk *ResolverKey) String() string {
	return fmt.Sprintf("%d", rk.id)
}

func (rk *ResolverKey) Raw() interface{} {
	return rk.id
}

type Loaders struct {
	loaders map[string]*dataloader.Loader
}

func CreateDataLoaders() *Loaders {
	return &Loaders{
		loaders: make(map[string]*dataloader.Loader, 1),
	}
}

func (l *Loaders) GetLoader(p graphql.ResolveParams, association *graph.Association, args graph.QueryArg, model *model.Model) *dataloader.Loader {
	contextValues := contexts.Values(p.Context)
	loaderId := fmt.Sprintf("%s@%s", association.Path(), contextValues.AppId)
	if l.loaders[loaderId] == nil {
		l.loaders[loaderId] = dataloader.NewBatchedLoader(QueryBatchFn(p, association, args, model))
	}
	return l.loaders[loaderId]
}

func QueryBatchFn(p graphql.ResolveParams, association *graph.Association, args graph.QueryArg, model *model.Model) dataloader.BatchFunc {
	return func(ctx context.Context, keys dataloader.Keys) []*dataloader.Result {
		defer utils.PrintErrorStack()
		//repos := repository.New(model)
		//repos.MakeAssociAbilityVerifier(p, association)
		results := make([]*dataloader.Result, len(keys))
		ids := make([]uint64, len(keys))
		for i := range ids {
			ids[i] = keys[i].Raw().(uint64)
		}
		s := service.New(p.Context, model.Graph)
		instances := s.BatchQueryAssociations(association, ids, args)

		for i := range results {
			var data interface{}
			associationInstances := findInstanceFromArray(ids[i], instances)
			if !association.IsArray() {
				ln := len(associationInstances)
				if ln > 1 {
					panic(fmt.Sprintf("To many values for %s : %d", association.Owner().Domain.Name+"."+association.Name(), len(associationInstances)))
				} else if ln == 1 {
					data = associationInstances[0]
				} else {
					data = nil
				}
			} else {
				data = associationInstances
			}
			results[i] = &dataloader.Result{
				Data: data,
			}
		}
		return results
	}
}

func findInstanceFromArray(id uint64, array []map[string]interface{}) []interface{} {
	var instances []interface{}
	for i, obj := range array {
		if obj[consts.ASSOCIATION_OWNER_ID] == id {
			instances = append(instances, array[i])
		}
	}
	return instances
}
