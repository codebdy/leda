package graph

import (
	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/model/domain"
	"codebdy.com/leda/services/entify/model/table"
)

type Entity struct {
	Class
	Table      *table.Table
	Interfaces []*Interface
}

func NewEntity(c *domain.Class) *Entity {
	return &Entity{
		Class: *NewClass(c),
	}
}

func (e *Entity) GetHasManyName() string {
	return utils.FirstUpper(consts.SET) + e.Name() + consts.HAS_MANY
}

func (e *Entity) GetHasOneName() string {
	return utils.FirstUpper(consts.SET) + e.Name() + consts.HAS_ONE
}

//有同名接口
func (e *Entity) hasInterfaceWithSameName() bool {
	return e.Domain.HasChildren()
}

//包含继承来的
func (e *Entity) AllAttributes() []*Attribute {
	attrs := []*Attribute{}
	attrs = append(attrs, e.attributes...)
	for i := range e.Interfaces {
		for j := range e.Interfaces[i].attributes {
			attr := e.Interfaces[i].attributes[j]
			if findAttribute(attr.Name, attrs) == nil {
				attrs = append(attrs, attr)
			}
		}
	}
	return attrs
}

func (e *Entity) Associations() []*Association {
	// associas := []*Association{}
	// associas = append(associas, e.associations...)
	// for i := range e.Interfaces {
	// 	for j := range e.Interfaces[i].associations {
	// 		asso := e.Interfaces[i].associations[j]
	// 		if findAssociation(asso.Name(), associas) == nil {
	// 			associas = append(associas, asso)
	// 		}
	// 	}
	// }
	return e.associations
}

func (e *Entity) GetAssociationByName(name string) *Association {
	//associations := e.AllAssociations()
	associations := e.associations
	for i := range associations {
		if associations[i].Name() == name {
			return associations[i]
		}
	}

	return nil
}

func (e *Entity) IsEmperty() bool {
	return len(e.AllAttributes()) < 1 && len(e.associations) < 1
}

func (e *Entity) AllAttributeNames() []string {
	names := make([]string, len(e.AllAttributes()))

	for i, attr := range e.AllAttributes() {
		names[i] = attr.Name
	}

	return names
}

func (e *Entity) GetAttributeByName(name string) *Attribute {
	for _, attr := range e.AllAttributes() {
		if attr.Name == name {
			return attr
		}
	}

	return nil
}

func findAttribute(name string, attrs []*Attribute) *Attribute {
	for i := range attrs {
		if attrs[i].Name == name {
			return attrs[i]
		}
	}
	return nil
}

func findAssociation(name string, assos []*Association) *Association {
	for i := range assos {
		if assos[i].Name() == name {
			return assos[i]
		}
	}
	return nil
}
