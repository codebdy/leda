package resolve

import (
	"github.com/graphql-go/graphql"
	"github.com/graphql-go/graphql/language/ast"
	"rxdrag.com/entify/consts"
)

func parseListFields(info graphql.ResolveInfo) []string {
	fields := []string{}
	if len(info.FieldASTs) > 0 {
		nodesSelections := info.FieldASTs[0].SelectionSet.Selections
		if len(nodesSelections) > 0 {
			noesField, ok := nodesSelections[0].(*ast.Field)
			if ok && noesField.Name.Value == consts.NODES {
				for _, fieldSelection := range noesField.SelectionSet.Selections {
					field, ok := fieldSelection.(*ast.Field)
					if ok {
						fields = append(fields, field.Name.Value)
					}
				}
			}
		}
	}
	return fields
}
