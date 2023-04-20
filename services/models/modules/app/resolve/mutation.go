package resolve

import (
	"log"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/leda-shared/utils"
	"codebdy.com/leda/services/models/service"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/data"
	"github.com/codebdy/entify/model/observer"
	"github.com/codebdy/entify/shared"
	"github.com/graphql-go/graphql"
)

func PostResolveFn(entityName string, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		objects := p.Args[consts.ARG_OBJECTS].([]map[string]interface{})

		s := service.New(p.Context, r)
		returing, err := s.Save(entityName, objects)

		if err != nil {
			return nil, err
		}
		observer.EmitObjectMultiPosted(returing, entityName, p.Context)
		return returing, nil
	}
}

//未实现
func SetResolveFn(entityName string, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		s := service.New(p.Context, r)
		objs := s.QueryEntity(entityName, p.Args, []string{}).Nodes
		convertedObjs := objs
		instances := []*data.Instance{}

		// for i := range convertedObjs {
		// 	obj := convertedObjs[i]
		// 	object := map[string]interface{}{}

		// 	object[consts.ID] = obj[consts.ID]

		// 	for key := range set {
		// 		object[key] = set[key]
		// 	}
		// }
		returing, err := s.Save(entityName, convertedObjs)

		if err != nil {
			return nil, err
		}

		//logs.WriteModelLog(model.Graph, &entity.Class, p.Context, logs.SET, logs.SUCCESS, "", p.Context.Value("gql"))

		return map[string]interface{}{
			consts.RESPONSE_RETURNING:    returing,
			consts.RESPONSE_AFFECTEDROWS: len(instances),
		}, nil
	}
}

func PostOneResolveFn(entityName string, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		object := p.Args[consts.ARG_OBJECT].(map[string]interface{})
		data.ConvertObjectId(object)

		s := service.New(p.Context, r)
		result, err := s.SaveOne(entityName, object)
		observer.EmitObjectPosted(result.(map[string]interface{}), entityName, p.Context)
		return result, err
	}
}

func DeleteByIdResolveFn(entityName string, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		argId := p.Args[consts.ID]

		s := service.New(p.Context, r)
		result, err := s.DeleteInstance(entityName, data.ConvertId(argId))
		observer.EmitObjectDeleted(result.(map[string]interface{}), entityName, p.Context)
		return result, err
	}
}

func DeleteResolveFn(entityName string, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		s := service.New(p.Context, r)
		objs := s.QueryEntity(entityName, p.Args, []string{consts.ID}).Nodes

		if objs == nil || len(objs) == 0 {
			return map[string]interface{}{
				consts.RESPONSE_RETURNING:    []interface{}{},
				consts.RESPONSE_AFFECTEDROWS: 0,
			}, nil
		}

		convertedObjs := objs

		ids := []shared.ID{}
		for i := range convertedObjs {
			ids = append(ids, data.ConvertId(convertedObjs[i][consts.ID]))
		}

		_, err := s.DeleteInstances(entityName, ids)
		if err != nil {
			log.Panic(err.Error())
		}
		observer.EmitObjectMultiDeleted(objs, entityName, p.Context)
		return map[string]interface{}{
			consts.RESPONSE_RETURNING:    objs,
			consts.RESPONSE_AFFECTEDROWS: len(ids),
		}, nil
	}
}
