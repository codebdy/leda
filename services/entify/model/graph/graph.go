package graph

import (
	"fmt"

	"codebdy.com/leda/services/entify/model/domain"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/model/table"
)

type Model struct {
	Enums        []*Enum
	Interfaces   []*Interface
	Entities     []*Entity
	ThirdParties []*ThirdParty
	ValueObjects []*Class
	Relations    []*Relation
	Tables       []*table.Table
}

func New(m *domain.Model) *Model {
	model := Model{}

	for i := range m.Enums {
		model.Enums = append(model.Enums, NewEnum(m.Enums[i]))
	}

	//构建所有接口
	for i := range m.Classes {
		cls := m.Classes[i]
		if cls.StereoType == meta.CLASSS_ABSTRACT {
			model.Interfaces = append(model.Interfaces, NewInterface(cls))
		}
	}

	for i := range m.Classes {
		cls := m.Classes[i]
		if cls.StereoType == meta.CLASSS_ENTITY {
			newEntity := NewEntity(cls)
			model.Entities = append(model.Entities, newEntity)
			//构建接口实现关系
			allParents := cls.AllParents()
			for j := range allParents {
				parentInterface := model.GetInterfaceByUuid(allParents[j].Uuid)
				if parentInterface == nil {
					panic("Can not find interface by uuid:" + allParents[j].Uuid)
				}
				parentInterface.Children = append(parentInterface.Children, newEntity)
				newEntity.Interfaces = append(newEntity.Interfaces, parentInterface)
			}
		} else if cls.StereoType == meta.CLASSS_ABSTRACT {
			allParents := cls.AllParents()
			intf := model.GetInterfaceByUuid(cls.Uuid)
			if intf == nil {
				panic("Can not find interface by uuid:" + cls.Uuid)
			}
			for j := range allParents {
				parentInterface := model.GetInterfaceByUuid(allParents[j].Uuid)
				if parentInterface == nil {
					panic("Can not find interface by uuid:" + allParents[j].Uuid)
				}
				intf.Parents = append(intf.Parents, parentInterface)
			}
		} else if cls.StereoType == meta.CLASS_VALUE_OBJECT {
			model.ValueObjects = append(model.ValueObjects, NewClass(cls))
		} else if cls.StereoType == meta.CLASS_THIRDPARTY {
			model.ThirdParties = append(model.ThirdParties, NewThirdParty(cls))
		}
	}

	//处理关联， 主要是把继承来的关联展平
	for i := range m.Relations {
		relation := m.Relations[i]
		model.makeRelation(relation)
	}

	//处理association，把Relatons 转换成associations
	for i := range model.Relations {
		relation := model.Relations[i]
		model.makeAssociations(relation)
	}

	//处理属性的实体类型跟枚举类型
	for i := range model.Interfaces {
		intf := model.Interfaces[i]
		model.makeInterface(intf)
	}

	for i := range model.Entities {
		ent := model.Entities[i]
		model.makeEntity(ent)
	}

	//处理Table
	for i := range model.Entities {
		ent := model.Entities[i]
		model.Tables = append(model.Tables, NewEntityTable(ent))
	}

	for i := range model.Relations {
		relation := model.Relations[i]
		//所有关系存关系表
		model.Tables = append(model.Tables, NewRelationTable(relation))
	}

	return &model
}

func (m *Model) makeRelation(relation *domain.Relation) {
	sourceEntities := []*Entity{}
	targetEntities := []*Entity{}
	sourceEntity := m.GetEntityByUuid(relation.Source.Uuid)
	if sourceEntity != nil {
		sourceEntities = append(sourceEntities, sourceEntity)
	} else {
		sourceInterface := m.GetInterfaceByUuid(relation.Source.Uuid)

		if sourceInterface == nil {
			panic("Can not find souce by uuid:" + relation.Source.Uuid)
		} else {
			sourceEntities = sourceInterface.Children
		}
	}

	targetEntity := m.GetEntityByUuid(relation.Target.Uuid)
	if targetEntity != nil {
		targetEntities = append(targetEntities, targetEntity)
	} else {
		targetInterface := m.GetInterfaceByUuid(relation.Target.Uuid)

		if targetInterface == nil {
			panic("Can not find target by uuid:" + relation.Target.Uuid)
		} else {
			targetEntities = targetInterface.Children
		}
	}

	if len(sourceEntities) == 0 || len(targetEntities) == 0 {
		return
	}

	for i := range sourceEntities {
		source := sourceEntities[i]
		for j := range targetEntities {
			target := targetEntities[j]
			r := NewRelation(
				relation,
				source,
				target,
			)
			m.Relations = append(m.Relations, r)
		}
	}
}

func (m *Model) makeAssociations(relation *Relation) {
	sourceEntity := relation.SourceEntity

	targetEntity := relation.TargetEntity

	sourceEntity.AddAssociation(NewAssociation(relation, sourceEntity.Uuid()))
	if relation.RelationType == meta.TWO_WAY_AGGREGATION ||
		relation.RelationType == meta.TWO_WAY_ASSOCIATION ||
		relation.RelationType == meta.TWO_WAY_COMBINATION {
		targetEntity.AddAssociation(NewAssociation(relation, targetEntity.Uuid()))
	}
}

func (m *Model) makeInterface(intf *Interface) {
	for j := range intf.attributes {
		attr := intf.attributes[j]
		if attr.Type == meta.ENUM || attr.Type == meta.ENUM_ARRAY {
			attr.EumnType = m.GetEnumByUuid(attr.TypeUuid)
		}

		if attr.Type == meta.ENTITY || attr.Type == meta.ENTITY_ARRAY {
			attr.EnityType = m.GetEntityByUuid(attr.TypeUuid)
		}

		if attr.Type == meta.VALUE_OBJECT || attr.Type == meta.VALUE_OBJECT_ARRAY {
			attr.ValueObjectType = m.GetValueObjectByUuid(attr.TypeUuid)
		}
	}
	for j := range intf.methods {
		method := intf.methods[j]
		if method.Method.Type == meta.ENUM || method.Method.Type == meta.ENUM_ARRAY {
			method.EumnType = m.GetEnumByUuid(method.Method.TypeUuid)
		}

		if method.Method.Type == meta.ENTITY || method.Method.Type == meta.ENTITY_ARRAY {
			method.EnityType = m.GetEntityByUuid(method.Method.TypeUuid)
		}

		if method.Method.Type == meta.VALUE_OBJECT || method.Method.Type == meta.VALUE_OBJECT_ARRAY {
			method.ValueObjectType = m.GetValueObjectByUuid(method.Method.TypeUuid)
		}
	}
}

func (m *Model) makeEntity(ent *Entity) {
	for j := range ent.attributes {
		attr := ent.attributes[j]
		if attr.Type == meta.ENUM || attr.Type == meta.ENUM_ARRAY {
			attr.EumnType = m.GetEnumByUuid(attr.TypeUuid)
		}

		if attr.Type == meta.ENTITY || attr.Type == meta.ENTITY_ARRAY {
			attr.EnityType = m.GetEntityByUuid(attr.TypeUuid)
		}

		if attr.Type == meta.VALUE_OBJECT || attr.Type == meta.VALUE_OBJECT_ARRAY {
			attr.ValueObjectType = m.GetValueObjectByUuid(attr.TypeUuid)
		}
	}
	for j := range ent.methods {
		method := ent.methods[j]
		if method.Method.Type == meta.ENUM || method.Method.Type == meta.ENUM_ARRAY {
			method.EumnType = m.GetEnumByUuid(method.Method.TypeUuid)
		}

		if method.Method.Type == meta.ENTITY || method.Method.Type == meta.ENTITY_ARRAY {
			method.EnityType = m.GetEntityByUuid(method.Method.TypeUuid)
		}

		if method.Method.Type == meta.VALUE_OBJECT || method.Method.Type == meta.VALUE_OBJECT_ARRAY {
			method.ValueObjectType = m.GetValueObjectByUuid(method.Method.TypeUuid)
		}
	}
}

func (m *Model) Validate() {
	//检查空实体（除ID外没有属性跟关联）
	for _, entity := range m.Entities {
		if entity.IsEmperty() {
			panic(fmt.Sprintf("Entity %s should have one normal field at least", entity.Name()))
		}
	}
}

func (m *Model) RootEnities() []*Entity {
	entities := []*Entity{}
	for i := range m.Entities {
		ent := m.Entities[i]
		if ent.Domain.Root {
			entities = append(entities, ent)
		}
	}

	return entities
}

func (m *Model) RootInterfaces() []*Interface {
	interfaces := []*Interface{}
	for i := range m.Interfaces {
		intf := m.Interfaces[i]
		if intf.Domain.Root {
			interfaces = append(interfaces, intf)
		}
	}

	return interfaces
}

func (m *Model) GetInterfaceByUuid(uuid string) *Interface {
	for i := range m.Interfaces {
		intf := m.Interfaces[i]
		if intf.Uuid() == uuid {
			return intf
		}
	}
	return nil
}

func (m *Model) GetEntityByUuid(uuid string) *Entity {
	for i := range m.Entities {
		ent := m.Entities[i]
		if ent.Uuid() == uuid {
			return ent
		}
	}
	return nil
}

func (m *Model) GetValueObjectByUuid(uuid string) *Class {
	for i := range m.ValueObjects {
		ent := m.ValueObjects[i]
		if ent.Uuid() == uuid {
			return ent
		}
	}
	return nil
}

func (m *Model) GetInterfaceByName(name string) *Interface {
	for i := range m.Interfaces {
		intf := m.Interfaces[i]
		if intf.Name() == name {
			return intf
		}
	}
	return nil
}

func (m *Model) GetEntityByName(name string) *Entity {
	for i := range m.Entities {
		ent := m.Entities[i]
		if ent.Name() == name {
			return ent
		}
	}
	return nil
}

func (m *Model) GetEntityByInnerId(innerId uint64) *Entity {
	for i := range m.Entities {
		ent := m.Entities[i]
		if ent.InnerId() == innerId {
			return ent
		}
	}
	return nil
}

func (m *Model) GetThirdPartyByName(name string) *ThirdParty {
	for i := range m.ThirdParties {
		third := m.ThirdParties[i]
		if third.Name() == name {
			return third
		}
	}
	return nil
}

func (m *Model) GetEnumByUuid(uuid string) *Enum {
	for i := range m.Enums {
		enum := m.Enums[i]
		if enum.Uuid == uuid {
			return enum
		}
	}
	return nil
}
