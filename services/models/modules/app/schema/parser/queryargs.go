package parser

import (
	"codebdy.com/leda/services/models/consts"
	"github.com/codebdy/entify/model/graph"
	"github.com/graphql-go/graphql"
)

func (p *ModelParser) makeQueryArgs() {
	for i := range p.model.Graph.Interfaces {
		if p.model.Graph.Interfaces[i].Domain.Root {
			p.makeOneInterfaceArgs(p.model.Graph.Interfaces[i])
		}
	}
	for i := range p.model.Graph.Entities {
		p.makeOneEntityArgs(p.model.Graph.Entities[i])
	}
	for i := range p.model.Graph.ThirdParties {
		p.makeOneThirdPartyArgs(p.model.Graph.ThirdParties[i])
	}

	p.makeRelaionWhereExp()
}

func (p *ModelParser) makeOneEntityArgs(entity *graph.Entity) {
	p.makeOneArgs(entity.Name(), entity.AllAttributes())
}

func (p *ModelParser) makeOneThirdPartyArgs(third *graph.ThirdParty) {
	p.makeOneArgs(third.Name(), third.Attributes())
}

func (p *ModelParser) makeOneInterfaceArgs(intf *graph.Interface) {
	p.makeOneArgs(intf.Name(), intf.AllAttributes())
}

// func (p *ModelParser) makeOnePartailArgs(partial *graph.Service) {
// 	p.makeOneArgs(partial.Name(), partial.AllAttributes())
// }

func (p *ModelParser) makeOneArgs(name string, attrs []*graph.Attribute) {
	whereExp := p.makeWhereExp(name, attrs)
	p.whereExpMap[name] = whereExp

	orderByExp := p.makeOrderBy(name, attrs)
	if len(orderByExp.Fields()) > 0 {
		p.orderByMap[name] = orderByExp
	}

	distinctOnEnum := p.makeDistinctOnEnum(name, attrs)
	p.distinctOnEnumMap[name] = distinctOnEnum
}

func (p *ModelParser) makeRelaionWhereExp() {
	for className := range p.whereExpMap {
		exp := p.whereExpMap[className]
		entity := p.model.Graph.GetEntityByName(className)
		third := p.model.Graph.GetThirdPartyByName(className)
		if entity == nil {
			if third == nil {
				panic("Fatal error, can not find class by name:" + className)
			} else {
				continue
			}
		}
		var associations []*graph.Association
		associations = entity.Associations()
		for i := range associations {
			assoc := associations[i]
			exp.AddFieldConfig(assoc.Name(), &graphql.InputObjectFieldConfig{
				Type: p.WhereExp(assoc.TypeEntity().Name()),
			})
		}
	}
}

func (p *ModelParser) makeWhereExp(name string, attrs []*graph.Attribute) *graphql.InputObject {
	expName := name + consts.BOOLEXP
	andExp := graphql.InputObjectFieldConfig{}
	notExp := graphql.InputObjectFieldConfig{}
	orExp := graphql.InputObjectFieldConfig{}

	fields := graphql.InputObjectConfigFieldMap{
		consts.ARG_AND: &andExp,
		consts.ARG_NOT: &notExp,
		consts.ARG_OR:  &orExp,
	}

	boolExp := graphql.NewInputObject(
		graphql.InputObjectConfig{
			Name:   expName,
			Fields: fields,
		},
	)
	andExp.Type = &graphql.List{
		OfType: &graphql.NonNull{
			OfType: boolExp,
		},
	}
	notExp.Type = boolExp
	orExp.Type = &graphql.List{
		OfType: &graphql.NonNull{
			OfType: boolExp,
		},
	}

	for i := range attrs {
		attr := attrs[i]
		columnExp := p.AttributeExp(attr)

		if columnExp != nil {
			fields[attr.Name] = columnExp
		}
	}
	return boolExp
}

func (p *ModelParser) makeOrderBy(name string, attrs []*graph.Attribute) *graphql.InputObject {
	fields := graphql.InputObjectConfigFieldMap{}

	orderByExp := graphql.NewInputObject(
		graphql.InputObjectConfig{
			Name:   name + consts.ORDERBY,
			Fields: fields,
		},
	)

	for i := range attrs {
		attr := attrs[i]
		attrOrderBy := p.AttributeOrderBy(attr)
		if attrOrderBy != nil {
			fields[attr.Name] = &graphql.InputObjectFieldConfig{Type: attrOrderBy}
		}
	}
	return orderByExp
}

func (p *ModelParser) makeDistinctOnEnum(name string, attrs []*graph.Attribute) *graphql.Enum {
	enumValueConfigMap := graphql.EnumValueConfigMap{}
	for i := range attrs {
		attr := attrs[i]
		enumValueConfigMap[attr.Name] = &graphql.EnumValueConfig{
			Value: attr.Name,
		}
	}

	entEnum := graphql.NewEnum(
		graphql.EnumConfig{
			Name:   name + consts.DISTINCTEXP,
			Values: enumValueConfigMap,
		},
	)
	return entEnum
}

func (p *ModelParser) QueryArgs(name string) graphql.FieldConfigArgument {
	config := graphql.FieldConfigArgument{
		consts.ARG_DISTINCTON: &graphql.ArgumentConfig{
			Type: p.DistinctOnEnum(name),
		},
		consts.ARG_LIMIT: &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
		consts.ARG_OFFSET: &graphql.ArgumentConfig{
			Type: graphql.Int,
		},
		consts.ARG_WHERE: &graphql.ArgumentConfig{
			Type: p.WhereExp(name),
		},
	}
	orderByExp := p.OrderByExp(name)

	if orderByExp != nil {
		config[consts.ARG_ORDERBY] = &graphql.ArgumentConfig{
			Type: &graphql.List{OfType: orderByExp},
		}
	}
	return config
}
