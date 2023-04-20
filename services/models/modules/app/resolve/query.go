package resolve

import (
	"fmt"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/leda-shared/utils"
	"codebdy.com/leda/services/models/service"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/meta"
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

func QueryOneEntityResolveFn(entity *graph.Entity, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		s := service.New(p.Context, r)
		instance := s.QueryOneEntity(entity, p.Args)
		return instance, nil
	}
}

func QueryEntityResolveFn(entity *graph.Entity, r *entify.Repository) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		s := service.New(p.Context, r)
		fields := parseListFields(p.Info)
		result := s.QueryEntity(entity, p.Args, fields)
		return result, nil
	}
}

func QueryAssociationFn(asso *graph.Association, r *entify.Repository) graphql.FieldResolveFn {
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
		loader := loaders.GetLoader(p, asso, p.Args, r)
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
