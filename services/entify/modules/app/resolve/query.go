package resolve

import (
	"fmt"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/model"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/service"
	"github.com/graphql-go/graphql"
)

// func QueryOneInterfaceResolveFn(intf *graph.Interface, model *model.Model) graphql.FieldResolveFn {
// 	return func(p graphql.ResolveParams) (interface{}, error) {
// 		defer utils.PrintErrorStack()
// 		//repos := repository.New(model)
// 		//repos.MakeInterfaceAbilityVerifier(p, intf)
// 		instance := service.QueryOneInterface(intf, p.Args)
// 		return instance, nil
// 	}
// }

// func QueryInterfaceResolveFn(intf *graph.Interface, model *model.Model) graphql.FieldResolveFn {
// 	return func(p graphql.ResolveParams) (interface{}, error) {
// 		defer utils.PrintErrorStack()
// 		//repos := repository.New(model)
// 		//repos.MakeInterfaceAbilityVerifier(p, intf)
// 		result := service.QueryInterface(intf, p.Args)
// 		return result, nil
// 	}
// }

func QueryOneEntityResolveFn(entity *graph.Entity, model *model.Model) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		s := service.New(p.Context, model.Graph)
		instance := s.QueryOneEntity(entity, p.Args)
		return instance, nil
	}
}

func QueryEntityResolveFn(entity *graph.Entity, model *model.Model) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		s := service.New(p.Context, model.Graph)
		fields := parseListFields(p.Info)
		result := s.QueryEntity(entity, p.Args, fields)
		return result, nil
	}
}

func QueryAssociationFn(asso *graph.Association, model *model.Model) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		var (
			source      = p.Source.(map[string]interface{})
			v           = p.Context.Value
			loaders     = v(consts.LOADERS).(*Loaders)
			handleError = func(err error) error {
				return fmt.Errorf(err.Error())
			}
		)
		defer utils.PrintErrorStack()

		if loaders == nil {
			panic("Data loaders is nil")
		}
		loader := loaders.GetLoader(p, asso, p.Args, model)
		thunk := loader.Load(p.Context, NewKey(source[consts.ID].(uint64)))
		return func() (interface{}, error) {
			data, err := thunk()
			if err != nil {
				return nil, handleError(err)
			}

			var retValue interface{}
			if data == nil {
				if asso.IsArray() {
					retValue = []map[string]interface{}{}
				} else {
					retValue = nil
				}
			} else {
				retValue = data
			}
			return retValue, nil
		}, nil
	}
}

func AttributeResolveFn(attr *graph.Attribute, model *model.Model) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		source := p.Source.(map[string]interface{})
		if attr.Type == meta.PASSWORD {
			return nil, nil
		}
		return source[attr.Name], nil
	}
}
