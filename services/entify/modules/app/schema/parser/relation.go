package parser

import (
	"codebdy.com/leda/services/entify/model"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/modules/app/resolve"
	"github.com/graphql-go/graphql"
)

func (p *ModelParser) makeRelations(model *model.Model) {
	// for i := range p.model.Graph.Interfaces {
	// intf := p.model.Graph.Interfaces[i]
	// interfaceType := p.interfaceTypeMap[intf.Name()]
	// if interfaceType == nil {
	// 	panic("Can find object type:" + intf.Name())
	// }
	// for _, association := range intf.AllAssociations() {
	// 	if interfaceType.Fields()[association.Name()] != nil {
	// 		panic("Duplicate interface field: " + intf.Name() + "." + association.Name())
	// 	}
	// 	interfaceType.AddFieldConfig(association.Name(), &graphql.Field{
	// 		Name:        association.Name(),
	// 		Type:        p.AssociationType(association),
	// 		Description: association.Description(),
	// 		Resolve:     resolve.QueryAssociationFn(association, model),
	// 		Args:        p.QueryArgs(association.TypeEntity().Name()),
	// 	})
	// }
	// }
	for i := range p.model.Graph.Entities {
		entity := p.model.Graph.Entities[i]
		objectType := p.objectTypeMap[entity.Name()]
		for _, association := range entity.Associations() {
			if objectType.Fields()[association.Name()] != nil {
				panic("Duplicate entity field: " + entity.Name() + "." + association.Name())
			}
			objectType.AddFieldConfig(association.Name(), &graphql.Field{
				Name:        association.Name(),
				Type:        p.AssociationType(association),
				Description: association.Description(),
				Resolve:     resolve.QueryAssociationFn(association, model),
				Args:        p.QueryArgs(association.TypeEntity().Name()),
			})
		}
	}
}

func (p *ModelParser) AssociationType(association *graph.Association) graphql.Output {
	if association.IsArray() {
		return &graphql.NonNull{
			OfType: &graphql.List{
				OfType: p.OutputType(association.TypeEntity().Name()),
			},
		}
	} else {
		return p.OutputType(association.TypeEntity().Name())
	}
}
