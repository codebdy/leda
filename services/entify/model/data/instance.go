package data

import (
	"fmt"
	"log"
	"strconv"
	"time"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/utils"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/model/table"
	"github.com/google/uuid"
)

type Field struct {
	Column *table.Column
	Value  interface{}
}

type Instance struct {
	Id           uint64
	Entity       *graph.Entity
	Fields       []*Field
	Associations []*AssociationRef
	isInsert     bool
	ValueMap     map[string]interface{}
}

func NewInstance(object map[string]interface{}, entity *graph.Entity) *Instance {
	instance := Instance{
		Entity:   entity,
		ValueMap: object,
	}
	if object[consts.ID] != nil {
		instance.Id = parseId(object[consts.ID])
	}

	if instance.IsEmperty() {
		return &instance
	}

	columns := entity.Table.Columns
	for i := range columns {
		column := columns[i]
		if column.CreateDate || column.UpdateDate {
			instance.Fields = append(instance.Fields, &Field{
				Column: column,
				Value:  time.Now(),
			})
		} else if column.Type == meta.UUID &&
			object[consts.ID] == nil &&
			column.AutoGenerate && object[column.Name] == nil {
			instance.Fields = append(instance.Fields, &Field{
				Column: column,
				Value:  uuid.New().String(),
			})
		} else if column.Type == meta.PASSWORD && object[column.Name] != nil {
			instance.Fields = append(instance.Fields, &Field{
				Column: column,
				Value:  utils.BcryptEncode(object[column.Name].(string)),
			})
		} else if object[column.Name] != nil && object[column.Name] != consts.ID { //ID额外处理
			instance.Fields = append(instance.Fields, &Field{
				Column: column,
				Value:  object[column.Name],
			})
		}
	}
	allAssociation := entity.Associations()
	for i := range allAssociation {
		asso := allAssociation[i]
		value := object[asso.Name()]
		if value != nil {
			ref := NewAssociation(value.(map[string]interface{}), asso)
			instance.Associations = append(instance.Associations, ref)
		}
	}
	return &instance
}

func (ins *Instance) IsEmperty() bool {
	id := ins.ValueMap[consts.ID]
	return len(ins.ValueMap) <= 1 &&
		(id != nil || ins.Id != 0)
}

//清空其它字段，保留ID跟关系，供二次保存使用
func (ins *Instance) Inserted(id uint64) {
	ins.Id = id
	ins.Fields = []*Field{}
}

//有ID也当插入来处理
func (ins *Instance) AsInsert() {
	ins.isInsert = true
}

func (ins *Instance) IsInsert() bool {
	if ins.isInsert {
		return true
	}
	for i := range ins.Fields {
		field := ins.Fields[i]
		if field.Column.Name == consts.ID {
			if field.Value != nil {
				return false
			}
		}
	}
	return true
}

func (ins *Instance) Table() *table.Table {
	return ins.Entity.Table
}

// func (ins *Instance) ColumnAssociations() []*AssociationRef {
// 	assocs := []*AssociationRef{}

// 	for i := range ins.Associations {
// 		assoc := ins.Associations[i]
// 		if assoc.Association.IsColumn() && !assoc.IsEmperty() {
// 			assocs = append(assocs, assoc)
// 		}
// 	}
// 	return assocs
// }

// func (ins *Instance) PovitAssociations() []*AssociationRef {
// 	assocs := []*AssociationRef{}

// 	for i := range ins.Associations {
// 		assoc := ins.Associations[i]
// 		if assoc.Association.IsPovitTable() && !assoc.IsEmperty() {
// 			assocs = append(assocs, assoc)
// 		}
// 	}
// 	return assocs
// }

// func (ins *Instance) TargetColumnAssociations() []*AssociationRef {
// 	assocs := []*AssociationRef{}

// 	for i := range ins.Associations {
// 		assoc := ins.Associations[i]
// 		if assoc.Association.IsTargetColumn() && !assoc.IsEmperty() {
// 			assocs = append(assocs, assoc)
// 		}
// 	}
// 	return assocs
// }

func parseId(id interface{}) uint64 {
	switch v := id.(type) {
	default:
		msg := fmt.Sprintf("unexpected id type %T", v)
		log.Panic(msg)
		panic(msg)
	case uint64:
		return id.(uint64)
	case string:
		u, err := strconv.ParseUint(id.(string), 0, 64)
		if err != nil {
			log.Panic(err.Error())
		}
		return u
	}
}
