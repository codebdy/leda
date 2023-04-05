package parser

import (
	"log"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/model/meta"
)

func (p *ModelParser) MethodArgs(methodArgs []meta.ArgMeta) graphql.FieldConfigArgument {
	args := graphql.FieldConfigArgument{}

	for _, arg := range methodArgs {
		args[arg.Name] = &graphql.ArgumentConfig{
			Type: p.argType(arg),
		}
	}

	return args
}

func (p *ModelParser) argType(arg meta.ArgMeta) graphql.Input {
	switch arg.Type {
	case meta.ENTITY:
		entity := p.model.Graph.GetEntityByUuid(arg.TypeUuid)
		if entity == nil {
			log.Panic("Can not find entity by uuid:" + arg.TypeUuid)
		}
		return p.SaveInput(entity.Name())
	case meta.ENTITY_ARRAY:
		entity := p.model.Graph.GetEntityByUuid(arg.TypeUuid)
		if entity == nil {
			log.Panic("Can not find entity by uuid:" + arg.TypeUuid)
		}
		return &graphql.NonNull{
			OfType: &graphql.List{
				OfType: &graphql.NonNull{
					OfType: p.SaveInput(entity.Name()),
				},
			},
		}
	}
	return PropertyType(arg.Type)
}
