package schema

import "github.com/graphql-go/graphql"

func convertFieldsArray(fields graphql.Fields) []*graphql.Field {
	covertedFields := []*graphql.Field{}
	for key, field := range fields {
		field.Name = key
		covertedFields = append(covertedFields, field)
	}
	return covertedFields
}
