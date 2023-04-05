package schema

import (
	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/model"
	"rxdrag.com/entify/modules/app/schema/parser"
)

type AppGraphqlSchema struct {
	QueryFields        []*graphql.Field
	MutationFields     []*graphql.Field
	SubscriptionFields []*graphql.Field
	Directives         []*graphql.Directive
	Types              []graphql.Type
	proccessor         *AppProcessor
}

type AppProcessor struct {
	Model       *model.Model
	modelParser parser.ModelParser
}

func New(model *model.Model) AppGraphqlSchema {
	processor := &AppProcessor{
		Model: model,
	}

	processor.modelParser.ParseModel(model)
	return AppGraphqlSchema{
		QueryFields:    processor.QueryFields(),
		MutationFields: processor.mutationFields(),
		Types:          processor.modelParser.EntityTypes(),
		proccessor:     processor,
	}
}

func (s *AppGraphqlSchema) Parser() *parser.ModelParser {
	return &s.proccessor.modelParser
}

func (s *AppGraphqlSchema) OutputType(name string) graphql.Type {
	return s.proccessor.modelParser.OutputType(name)
}
