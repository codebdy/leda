package parser

import (
	"fmt"

	"codebdy.com/leda/services/models/consts"
	"github.com/codebdy/entify/model/graph"
	"github.com/graphql-go/graphql"
)

func (p *ModelParser) makeInputs() {
	for i := range p.model.Graph.Entities {
		entity := p.model.Graph.Entities[i]
		p.setInputMap[entity.Name()] = p.makeEntitySetInput(entity)
		p.saveInputMap[entity.Name()] = p.makeEntitySaveInput(entity)
		p.mutationResponseMap[entity.Name()] = p.makeEntityMutationResponseType(entity)
	}

	for i := range p.model.Graph.Entities {
		entity := p.model.Graph.Entities[i]
		p.hasManyInputMap[entity.Name()] = p.makeEntityHasManyInput(entity)
		p.hasOneInputMap[entity.Name()] = p.makeEntityHasOneInput(entity)
	}

	//for i := range p.model.Graph.Services {
	// partial := p.model.Graph.Services[i]
	// p.hasManyInputMap[partial.Name()] = p.makePartailHasManyInput(partial)
	// p.hasOneInputMap[partial.Name()] = p.makePartialHasOneInput(partial)
	//}

	p.makeEntityInputRelations()
}

func (p *ModelParser) makeHasManyInput(entity *graph.Entity, hasManyname string) *graphql.InputObject {
	typeInput := p.SaveInput(entity.Name())
	listType := &graphql.List{
		OfType: typeInput,
	}
	return graphql.NewInputObject(graphql.InputObjectConfig{
		Name: hasManyname,
		Fields: graphql.InputObjectConfigFieldMap{
			consts.ARG_ADD: &graphql.InputObjectFieldConfig{
				Type: listType,
			},
			consts.ARG_DELETE: &graphql.InputObjectFieldConfig{
				Type: listType,
			},
			consts.ARG_UPDATE: &graphql.InputObjectFieldConfig{
				Type: listType,
			},
			consts.ARG_SYNC: &graphql.InputObjectFieldConfig{
				Type: listType,
			},
			consts.ARG_CASCADE: &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
		},
	})
}

func (p *ModelParser) makeEntityHasManyInput(entity *graph.Entity) *graphql.InputObject {
	return p.makeHasManyInput(entity, entity.GetHasManyName())
}

func (p *ModelParser) makeHasOneInput(entity *graph.Entity, hasOneName string) *graphql.InputObject {
	typeInput := p.SaveInput(entity.Name())
	return graphql.NewInputObject(graphql.InputObjectConfig{
		Name: hasOneName,
		Fields: graphql.InputObjectConfigFieldMap{
			consts.ARG_CLEAR: &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
			consts.ARG_SYNC: &graphql.InputObjectFieldConfig{
				Type: typeInput,
			},
			consts.ARG_CASCADE: &graphql.InputObjectFieldConfig{
				Type: graphql.Boolean,
			},
		},
	})
}

func (p *ModelParser) makeEntityHasOneInput(entity *graph.Entity) *graphql.InputObject {
	return p.makeHasOneInput(entity, entity.GetHasOneName())
}

func (p *ModelParser) makeEntityInputRelations() {
	for i := range p.model.Graph.Entities {
		entity := p.model.Graph.Entities[i]

		input := p.setInputMap[entity.Name()]
		update := p.saveInputMap[entity.Name()]

		associas := entity.Associations()

		for i := range associas {
			assoc := associas[i]

			typeInput := p.SaveInput(assoc.Owner().Name())
			if typeInput == nil {
				panic("can not find save input:" + assoc.Owner().Name())
			}
			if len(typeInput.Fields()) == 0 {
				fmt.Println("Fields == 0")
				continue
			}

			arrayType := p.getAssociationType(assoc)

			if arrayType == nil {
				panic("Can not get association type:" + assoc.Owner().Name() + "." + assoc.Name())
			}
			input.AddFieldConfig(assoc.Name(), &graphql.InputObjectFieldConfig{
				Type:        arrayType,
				Description: assoc.Description(),
			})
			update.AddFieldConfig(assoc.Name(), &graphql.InputObjectFieldConfig{
				Type:        arrayType,
				Description: assoc.Description(),
			})
		}
	}
}

func (p *ModelParser) getAssociationType(association *graph.Association) *graphql.InputObject {
	if association.IsArray() {
		return p.HasManyInput(association.TypeEntity().Name())
	} else {
		return p.HasOneInput(association.TypeEntity().Name())
	}
}

func (p *ModelParser) inputFields(entity *graph.Entity, withId bool) graphql.InputObjectConfigFieldMap {
	fields := graphql.InputObjectConfigFieldMap{}
	for _, column := range entity.AllAttributes() {
		if (column.Name != consts.ID || withId) && !column.DeleteDate && !column.CreateDate && !column.UpdateDate {
			fields[column.Name] = &graphql.InputObjectFieldConfig{
				Type:        p.InputPropertyType(column),
				Description: column.Description,
			}
		}
	}
	return fields
}

func (p *ModelParser) makeEntitySaveInput(entity *graph.Entity) *graphql.InputObject {
	name := entity.Name() + consts.INPUT
	return graphql.NewInputObject(
		graphql.InputObjectConfig{
			Name:   name,
			Fields: p.inputFields(entity, true),
		},
	)
}

func (p *ModelParser) makeEntitySetInput(entity *graph.Entity) *graphql.InputObject {
	return graphql.NewInputObject(
		graphql.InputObjectConfig{
			Name:   entity.Name() + consts.SET_INPUT,
			Fields: p.inputFields(entity, false),
		},
	)
}

func (p *ModelParser) makeEntityMutationResponseType(entity *graph.Entity) *graphql.Object {
	var returnValue *graphql.Object

	returnValue = graphql.NewObject(
		graphql.ObjectConfig{
			Name: entity.Name() + consts.MUTATION_RESPONSE,
			Fields: graphql.Fields{
				consts.RESPONSE_AFFECTEDROWS: &graphql.Field{
					Type: graphql.Int,
				},
				consts.RESPONSE_RETURNING: &graphql.Field{
					Type: &graphql.NonNull{
						OfType: &graphql.List{
							OfType: p.OutputType(entity.Name()),
						},
					},
				},
			},
		},
	)

	return returnValue
}
