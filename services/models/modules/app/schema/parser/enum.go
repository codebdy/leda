package parser

import (
	"github.com/codebdy/entify/model/graph"
	"github.com/graphql-go/graphql"
)

func (p *ModelParser) makeEnums(enums []*graph.Enum) {
	for i := range enums {
		enum := enums[i]
		p.enumTypeMap[enum.Name] = EnumType(enum)
	}
}

func EnumType(entity *graph.Enum) *graphql.Enum {
	enumValueConfigMap := graphql.EnumValueConfigMap{}
	for _, value := range entity.Values {
		enumValueConfigMap[value] = &graphql.EnumValueConfig{
			Value: value,
		}
	}
	enum := graphql.NewEnum(
		graphql.EnumConfig{
			Name:   entity.Name,
			Values: enumValueConfigMap,
		},
	)
	return enum
}
