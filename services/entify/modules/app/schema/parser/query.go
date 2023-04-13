package parser

import (
	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app/resolve"
	"github.com/graphql-go/graphql"
)

func (p *ModelParser) ClassListType(cls *graph.Class) *graphql.Object {
	name := cls.Name()
	listName := cls.ListName()

	if p.listMap[listName] != nil {
		return p.listMap[listName]
	}

	returnValue := graphql.NewObject(
		graphql.ObjectConfig{
			Name: listName,
			Fields: graphql.Fields{
				consts.NODES: &graphql.Field{
					Type: &graphql.List{
						OfType: p.OutputType(name),
					},
				},
				consts.TOTAL: &graphql.Field{
					Type: graphql.Int,
				},
			},
		},
	)

	p.listMap[listName] = returnValue
	return returnValue
}

func (p *ModelParser) EntityListType(entity *graph.Entity) *graphql.Object {
	name := entity.Name()
	listName := entity.ListName()

	if p.listMap[listName] != nil {
		return p.listMap[listName]
	}

	returnValue := graphql.NewObject(
		graphql.ObjectConfig{
			Name: listName,
			Fields: graphql.Fields{
				consts.NODES: &graphql.Field{
					Type: &graphql.List{
						OfType: p.OutputType(name),
					},
				},
				consts.TOTAL: &graphql.Field{
					Type: graphql.Int,
				},
				consts.AGGREGATE: &graphql.Field{
					Type: p.aggregateType(entity),
				},
			},
		},
	)

	p.listMap[listName] = returnValue
	return returnValue
}

func (p *ModelParser) makeEntityOutputObjects(entities []*graph.Entity) {
	for i := range entities {
		p.makeEntityObject(entities[i])
	}
}

func (p *ModelParser) makeEntityObject(entity *graph.Entity) {
	objType := p.ObjectType(entity)
	p.objectTypeMap[entity.Name()] = objType
	p.objectMapById[entity.InnerId()] = objType
}

func (p *ModelParser) makeThirdPartyOutputObjects(thirds []*graph.ThirdParty) {
	for i := range thirds {
		p.makeThirdPartyObject(thirds[i])
	}
}

func (p *ModelParser) makeThirdPartyObject(third *graph.ThirdParty) {
	objType := graphql.NewObject(
		graphql.ObjectConfig{
			Name:        third.Name(),
			Fields:      p.OutputFields(third.Attributes()),
			Description: third.Description(),
		},
	)
	p.objectTypeMap[third.Name()] = objType
	p.objectMapById[third.InnerId()] = objType
}

func (p *ModelParser) ObjectType(entity *graph.Entity) *graphql.Object {
	name := entity.Name()
	interfaces := p.mapInterfaces(entity.Interfaces)

	if len(interfaces) > 0 {
		return graphql.NewObject(
			graphql.ObjectConfig{
				Name:        name,
				Fields:      p.OutputFields(entity.AllAttributes()),
				Description: entity.Description(),
				Interfaces:  interfaces,
			},
		)
	} else {
		return graphql.NewObject(
			graphql.ObjectConfig{
				Name:        name,
				Fields:      p.OutputFields(entity.AllAttributes()),
				Description: entity.Description(),
			},
		)
	}

}

func (p *ModelParser) OutputFields(attrs []*graph.Attribute) graphql.Fields {
	fields := graphql.Fields{}
	for _, attr := range attrs {
		if attr.Type != meta.PASSWORD {
			fields[attr.Name] = &graphql.Field{
				Type:        PropertyType(attr.GetType()),
				Description: attr.Description,
				Resolve:     resolve.AttributeResolveFn(attr, p.model),
				// Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				// 	fmt.Println(p.Context.Value("data"))
				// 	return "world", nil
				// },
			}
		}
	}

	return fields
}
