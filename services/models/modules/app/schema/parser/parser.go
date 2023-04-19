package parser

import (
	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/engify/model"
	"codebdy.com/leda/services/models/entify/model/graph"
	"codebdy.com/leda/services/models/leda-shared/utils"
	"github.com/graphql-go/graphql"
)

type ModelParser struct {
	model                *model.Model
	objectTypeMap        map[string]*graphql.Object
	objectMapById        map[uint64]*graphql.Object
	enumTypeMap          map[string]*graphql.Enum
	interfaceTypeMap     map[string]*graphql.Interface
	setInputMap          map[string]*graphql.InputObject
	saveInputMap         map[string]*graphql.InputObject
	hasManyInputMap      map[string]*graphql.InputObject
	hasOneInputMap       map[string]*graphql.InputObject
	whereExpMap          map[string]*graphql.InputObject
	distinctOnEnumMap    map[string]*graphql.Enum
	orderByMap           map[string]*graphql.InputObject
	enumComparisonExpMap map[string]*graphql.InputObjectFieldConfig
	mutationResponseMap  map[string]*graphql.Object
	aggregateMap         map[string]*graphql.Object
	listMap              map[string]*graphql.Object
	selectColumnsMap     map[string]*graphql.InputObject
}

func (p *ModelParser) ParseModel(model *model.Model) {
	p.reset()
	p.model = model
	p.makeEnums(p.model.Graph.Enums)
	p.makeOutputInterfaces(p.model.Graph.Interfaces)
	p.makeEntityOutputObjects(p.model.Graph.Entities)
	p.makeThirdPartyOutputObjects(p.model.Graph.ThirdParties)
	p.makeQueryArgs()
	p.makeRelations(model)
	p.makeInputs()
}

func (p *ModelParser) reset() {
	p.objectTypeMap = make(map[string]*graphql.Object)
	p.objectMapById = make(map[uint64]*graphql.Object)
	p.enumTypeMap = make(map[string]*graphql.Enum)
	p.interfaceTypeMap = make(map[string]*graphql.Interface)
	p.setInputMap = make(map[string]*graphql.InputObject)
	p.saveInputMap = make(map[string]*graphql.InputObject)
	p.hasManyInputMap = make(map[string]*graphql.InputObject)
	p.hasOneInputMap = make(map[string]*graphql.InputObject)
	p.whereExpMap = make(map[string]*graphql.InputObject)
	p.distinctOnEnumMap = make(map[string]*graphql.Enum)
	p.orderByMap = make(map[string]*graphql.InputObject)
	p.enumComparisonExpMap = make(map[string]*graphql.InputObjectFieldConfig)
	p.mutationResponseMap = make(map[string]*graphql.Object)
	p.aggregateMap = make(map[string]*graphql.Object)
	p.listMap = make(map[string]*graphql.Object)
	p.selectColumnsMap = make(map[string]*graphql.InputObject)
}

func (p *ModelParser) InterfaceOutputType(name string) *graphql.Interface {
	intf := p.interfaceTypeMap[name]
	if intf != nil {
		return intf
	}
	panic("Can not find interface output type of " + name)
}

func (p *ModelParser) EntityeOutputType(name string) *graphql.Object {
	obj := p.objectTypeMap[name]
	if obj == nil {
		panic("Can not find output type of " + name)
	}
	return obj
}

func (p *ModelParser) OutputType(name string) graphql.Type {
	intf := p.interfaceTypeMap[name]
	if intf != nil {
		return intf
	}
	obj := p.objectTypeMap[name]
	if obj == nil {
		panic("Can not find output type of " + name)
	}
	return obj
}

func (p *ModelParser) GetEntityTypeByInnerId(id uint64) *graphql.Object {
	return p.objectMapById[id]
}

func (p *ModelParser) EntityTypes() []graphql.Type {
	objs := []graphql.Type{}
	for key := range p.objectTypeMap {
		objs = append(objs, p.objectTypeMap[key])
	}

	return objs
}

func (p *ModelParser) EntityObjects() []*graphql.Object {
	objs := []*graphql.Object{}
	for key := range p.objectTypeMap {
		objs = append(objs, p.objectTypeMap[key])
	}

	return objs
}

func (p *ModelParser) EnumType(name string) *graphql.Enum {
	return p.enumTypeMap[name]
}

func (p *ModelParser) WhereExp(name string) *graphql.InputObject {
	return p.whereExpMap[name]
}

func (p *ModelParser) OrderByExp(name string) *graphql.InputObject {
	return p.orderByMap[name]
}

func (p *ModelParser) DistinctOnEnum(name string) *graphql.Enum {
	return p.distinctOnEnumMap[name]
}

func (p *ModelParser) DistinctOnEnums() map[string]*graphql.Enum {
	return p.distinctOnEnumMap
}

func (p *ModelParser) SaveInput(name string) *graphql.InputObject {
	return p.saveInputMap[name]
}

func (p *ModelParser) SetInput(name string) *graphql.InputObject {
	return p.setInputMap[name]
}

func (p *ModelParser) HasManyInput(name string) *graphql.InputObject {
	return p.hasManyInputMap[name]
}
func (p *ModelParser) HasOneInput(name string) *graphql.InputObject {
	return p.hasOneInputMap[name]
}

func (p *ModelParser) MutationResponse(name string) *graphql.Object {
	return p.mutationResponseMap[name]
}

func (p *ModelParser) mapInterfaces(entities []*graph.Interface) []*graphql.Interface {
	interfaces := []*graphql.Interface{}
	for i := range entities {
		interfaces = append(interfaces, p.interfaceTypeMap[entities[i].Domain.Name])
	}

	return interfaces
}

func (p *ModelParser) makeOutputInterfaces(interfaces []*graph.Interface) {
	for i := range interfaces {
		intf := interfaces[i]
		p.interfaceTypeMap[intf.Name()] = p.InterfaceType(intf)
	}
}

func (p *ModelParser) InterfaceType(intf *graph.Interface) *graphql.Interface {
	name := intf.Name()

	return graphql.NewInterface(
		graphql.InterfaceConfig{
			Name:        name,
			Fields:      p.OutputFields(intf.AllAttributes()),
			Description: intf.Description(),
			ResolveType: p.resolveTypeFn,
		},
	)
}

func (p *ModelParser) resolveTypeFn(parm graphql.ResolveTypeParams) *graphql.Object {
	if value, ok := parm.Value.(map[string]interface{}); ok {
		if id, ok := value[consts.ID].(uint64); ok {
			entityInnerId := utils.DecodeEntityInnerId(id)
			return p.GetEntityTypeByInnerId(entityInnerId)
		}
	}
	return nil
}
