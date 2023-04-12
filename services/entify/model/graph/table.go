package graph

import (
	"fmt"

	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/model/table"
)

func NewEntityTable(entity *Entity) *table.Table {
	table := &table.Table{
		Uuid:          entity.Uuid(),
		Name:          entity.TableName(),
		EntityInnerId: entity.Domain.InnerId,
	}

	allAttrs := entity.AllAttributes()
	for i := range allAttrs {
		attr := allAttrs[i]
		table.Columns = append(table.Columns, NewAttributeColumn(attr))
	}

	// allAssocs := entity.associations

	// for i := range allAssocs {
	// 	assoc := allAssocs[i]
	// 	if assoc.IsColumn() {
	// 		table.Columns = append(table.Columns, NewAssociationColumn(assoc))
	// 	}
	// }

	entity.Table = table
	return table
}

func NewAttributeColumn(attr *Attribute) *table.Column {
	return &table.Column{
		AttributeMeta: attr.AttributeMeta,
	}
}

// func NewAssociationColumn(assoc *Association) *table.Column {
// 	return &table.Column{
// 		AttributeMeta: meta.AttributeMeta{
// 			Type:     meta.ID,
// 			Uuid:     assoc.Name() + assoc.Relation.Uuid,
// 			Name:     utils.SnakeString(assoc.Name()) + "_id",
// 			Index:    true,
// 			Nullable: true,
// 		},
// 	}
// }

func NewRelationTable(relation *Relation) *table.Table {
	prefix := consts.PIVOT
	if relation.AppId != 1 {
		prefix = fmt.Sprintf("%s%d%s", consts.TABLE_PREFIX, relation.AppId, consts.PIVOT)
	}
	name := fmt.Sprintf(
		"%s_%d_%d_%d",
		prefix,
		relation.SourceEntity.InnerId(),
		relation.InnerId,
		relation.TargetEntity.InnerId(),
	)

	tab := &table.Table{
		Uuid: relation.SourceEntity.Uuid() + relation.Uuid + relation.TargetEntity.Uuid(),
		Name: name,
		Columns: []*table.Column{
			{
				AttributeMeta: meta.AttributeMeta{
					Type:  meta.ID,
					Uuid:  relation.SourceEntity.Uuid() + relation.Uuid,
					Name:  relation.SourceEntity.TableName(),
					Index: true,
				},
			},
			{
				AttributeMeta: meta.AttributeMeta{
					Type:  meta.ID,
					Uuid:  relation.TargetEntity.Uuid() + relation.Uuid,
					Name:  relation.TargetEntity.TableName(),
					Index: true,
				},
			},
		},
		//PKString: fmt.Sprintf("%s,%s", relation.SourceEntity.TableName(), relation.TargetEntity.TableName()),
	}
	if relation.EnableAssociaitonClass {
		for i := range relation.AssociationClass.Attributes {
			tab.Columns = append(tab.Columns, &table.Column{
				AttributeMeta: relation.AssociationClass.Attributes[i],
			})
		}
	}
	relation.Table = tab

	return tab
}
