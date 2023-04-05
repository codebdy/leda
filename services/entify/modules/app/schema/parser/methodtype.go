package parser

import (
	"log"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/model/meta"
)

func (p *ModelParser) OrchestrationType(orchestration *meta.OrchestrationMeta) graphql.Output {
	switch orchestration.Type {
	case meta.ENTITY:
		entity := p.model.Graph.GetEntityByUuid(orchestration.TypeUuid)
		if entity == nil {
			log.Panic("Can not find entity by uuid:" + orchestration.TypeUuid)
		}
		return p.OutputType(entity.Name())
	case meta.ENTITY_ARRAY:
		entity := p.model.Graph.GetEntityByUuid(orchestration.TypeUuid)
		if entity == nil {
			log.Panic("Can not find entity by uuid:" + orchestration.TypeUuid)
		}
		return p.EntityListType(entity)
	}
	return PropertyType(orchestration.Type)
}
