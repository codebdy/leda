package schema

import (
	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
	"rxdrag.com/entify-schema-registry/consts"
	"rxdrag.com/entify-schema-registry/repository"
	"rxdrag.com/entify-schema-registry/utils"
)

const INPUT = "input"

var serviceInputType = graphql.NewInputObject(
	graphql.InputObjectConfig{
		Name: "ServiceInput",
		Fields: graphql.InputObjectConfigFieldMap{
			consts.ID: &graphql.InputObjectFieldConfig{
				Type: graphql.Int,
			},
			consts.URL: &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			consts.NAME: &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
			consts.SERVICETYPE: &graphql.InputObjectFieldConfig{
				Type: graphql.String,
			},
		},
	},
)

func mutationFields() graphql.Fields {
	return graphql.Fields{
		"addService": &graphql.Field{
			Type: serviceType,
			Args: graphql.FieldConfigArgument{
				INPUT: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: serviceInputType,
					},
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer utils.PrintErrorStack()
				service := repository.Service{}
				mapstructure.Decode(p.Args[INPUT], &service)
				return repository.AddService(service), nil
			},
		},
		"removeService": &graphql.Field{
			Type: serviceType,
			Args: graphql.FieldConfigArgument{
				consts.ID: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: graphql.Int,
					},
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer utils.PrintErrorStack()
				id := p.Args[consts.ID].(int)
				oldService := repository.GetService(id)
				repository.RemoveService(id)
				return oldService, nil
			},
		},
		"updateService": &graphql.Field{
			Type: serviceType,
			Args: graphql.FieldConfigArgument{
				INPUT: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: serviceInputType,
					},
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer utils.PrintErrorStack()
				service := repository.Service{}
				mapstructure.Decode(p.Args[INPUT], &service)
				repository.UpdateService(service)
				return repository.GetService(service.Id), nil
			},
		},
	}
}
