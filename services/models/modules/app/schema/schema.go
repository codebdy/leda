package schema

import (
	"codebdy.com/leda/services/models/modules/app/schema/parser"
	"github.com/codebdy/entify"
	"github.com/graphql-go/graphql"
)

type AppGraphqlSchema struct {
	QueryFields    []*graphql.Field
	MutationFields []*graphql.Field
	Directives     []*graphql.Directive
	Types          []graphql.Type
	proccessor     *AppProcessor
}

type AppProcessor struct {
	Repo        *entify.Repository
	modelParser parser.ModelParser
}

func New(r *entify.Repository) AppGraphqlSchema {
	processor := &AppProcessor{
		Repo: r,
	}

	processor.modelParser.ParseModel(r)
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
