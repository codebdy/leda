package domain

import (
	"rxdrag.com/entify/model/meta"
)

type Model struct {
	Enums     []*Enum
	Classes   []*Class
	Relations []*Relation
}

func New(m *meta.Model) *Model {
	model := Model{}

	for i := range m.Classes {
		class := m.Classes[i]
		if class.StereoType == meta.CLASSS_ENUM {
			model.Enums = append(model.Enums, NewEnum(class))
		} else {
			model.Classes = append(model.Classes, NewClass(class))
		}
	}

	for i := range m.Relations {
		relation := m.Relations[i]

		src := model.GetClassByUuid(relation.SourceId)
		tar := model.GetClassByUuid(relation.TargetId)
		if src == nil || tar == nil {
			panic("Meta is not integral, can not find class of relation:" + relation.Uuid)
		}
		if relation.RelationType == meta.INHERIT {
			src.Parents = append(src.Parents, tar)
			tar.Children = append(tar.Children, src)
		} else {
			r := NewRelation(relation, src, tar)
			model.Relations = append(model.Relations, r)
		}
	}

	return &model
}

func (m *Model) GetClassByUuid(uuid string) *Class {
	for i := range m.Classes {
		cls := m.Classes[i]
		if cls.Uuid == uuid {
			return cls
		}
	}

	return nil
}
