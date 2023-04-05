package data

import (
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/table"
)

type AssociationRef struct {
	Association *graph.Association
	Added       []*Instance
	Deleted     []*Instance
	Updated     []*Instance
	Synced      []*Instance
	Clear       bool
	isCascade   bool
}

func NewAssociation(value map[string]interface{}, assoc *graph.Association) *AssociationRef {
	AssociationRef := AssociationRef{
		Association: assoc,
	}

	AssociationRef.init(value)
	return &AssociationRef
}

func (r *AssociationRef) init(value map[string]interface{}) {
	if value[consts.ARG_CLEAR] != nil {
		r.Clear = value[consts.ARG_CLEAR].(bool)
	}
	r.Deleted = r.convertToInstances(value[consts.ARG_DELETE])
	r.Added = r.convertToInstances(value[consts.ARG_ADD])
	r.Updated = r.convertToInstances(value[consts.ARG_UPDATE])
	r.Synced = r.convertToInstances(value[consts.ARG_SYNC])
	if value[consts.ARG_CASCADE] != nil {
		r.isCascade = value[consts.ARG_CASCADE].(bool)
	}
}

func (r *AssociationRef) Cascade() bool {
	return r.Association.IsCombination() || r.isCascade
}

func (r *AssociationRef) IsEmperty() bool {
	return len(r.Added) == 0 && len(r.Updated) == 0 && len(r.Deleted) == 0 && len(r.Synced) == 0
}

// func (r *AssociationRef) AssociatedId() interface{} {
// 	if !r.Association.IsColumn() {
// 		log.Panic("Assoicion is not the entity column, but as column to treat")
// 	}
// 	if len(r.Synced) != 0 {
// 		return r.Synced[0]
// 	} else if len(r.Added) != 0 {
// 		return r.Added[0]
// 	} else if len(r.Updated) != 0 {
// 		return r.Updated[0]
// 	}
// 	return nil
// }

func doConvertToInstances(data interface{}, isArray bool, entity *graph.Entity) []*Instance {
	instances := []*Instance{}
	if data == nil {
		return []*Instance{}
	}
	if isArray {
		objects := data.([]interface{})
		for i := range objects {
			instances = append(instances, NewInstance(objects[i].(map[string]interface{}), entity))
		}
	} else {
		instances = append(instances, NewInstance(data.(map[string]interface{}), entity))
	}

	return instances
}

func (r *AssociationRef) convertToInstances(data interface{}) []*Instance {
	return doConvertToInstances(data, r.Association.IsArray(), r.TypeEntity())
}

func (r *AssociationRef) SourceColumn() *table.Column {
	for i := range r.Association.Relation.Table.Columns {
		column := r.Association.Relation.Table.Columns[i]
		if column.Name == r.Association.Relation.SourceEntity.TableName() {
			return column
		}
	}
	return nil
}

func (r *AssociationRef) TargetColumn() *table.Column {
	for i := range r.Association.Relation.Table.Columns {
		column := r.Association.Relation.Table.Columns[i]
		if column.Name == r.Association.Relation.TargetEntity.TableName() {
			return column
		}
	}
	return nil
}

func (r *AssociationRef) Table() *table.Table {
	return r.Association.Relation.Table
}

func (r *AssociationRef) IsSource() bool {
	return r.Association.IsSource()
}

func (r *AssociationRef) OwnerColumn() *table.Column {
	if r.IsSource() {
		return r.SourceColumn()
	} else {
		return r.TargetColumn()
	}
}
func (r *AssociationRef) TypeColumn() *table.Column {
	if !r.IsSource() {
		return r.SourceColumn()
	} else {
		return r.TargetColumn()
	}
}

func (r *AssociationRef) TypeEntity() *graph.Entity {
	entity := r.Association.TypeEntity()
	if entity != nil {
		return entity
	}

	panic("Can not find reference entity")
}
