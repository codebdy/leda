package dialect

import (
	"codebdy.com/leda/services/entify/db/dialect/mysql"
	"codebdy.com/leda/services/entify/model"
	"codebdy.com/leda/services/entify/model/data"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/table"
)

const (
	MySQL = "mysql"
)

type SQLBuilder interface {
	BuildCreateMetaSQL() string
	BuildBoolExp(argEntity *graph.ArgEntity, where map[string]interface{}) (string, []interface{})
	BuildFieldExp(fieldName string, fieldArgs map[string]interface{}) (string, []interface{})

	BuildCreateTableSQL(table *table.Table) string
	BuildDeleteTableSQL(table *table.Table) string
	BuildColumnSQL(column *table.Column) string
	BuildModifyTableAtoms(diff *model.TableDiff) []model.ModifyAtom
	ColumnTypeSQL(column *table.Column) string

	BuildQuerySQLBody(argEntity *graph.ArgEntity, fields []*graph.Attribute) string
	BuildQueryCountSQLBody(argEntity *graph.ArgEntity) string
	BuildWhereSQL(argEntity *graph.ArgEntity, fields []*graph.Attribute, where map[string]interface{}) (string, []interface{})
	BuildOrderBySQL(argEntity *graph.ArgEntity, orderBy interface{}) string
	//BuildQuerySQL(tableName string, fields []*graph.Attribute, args map[string]interface{}) (string, []interface{})

	BuildInsertSQL(fields []*data.Field, table *table.Table) string
	BuildUpdateSQL(id uint64, fields []*data.Field, table *table.Table) string

	BuildQueryByIdsSQL(entity *graph.Entity, idCounts int) string
	BuildCheckAssociationSQL(ownerId uint64, tableName string, ownerFieldName string) string
	BuildClearAssociationSQL(ownerId uint64, tableName string, ownerFieldName string) string
	BuildQueryAssociatedInstancesSQL(entity *graph.Entity,
		ownerId uint64,
		povitTableName string,
		ownerFieldName string,
		typeFieldName string,
	) string
	BuildBatchAssociationBodySQL(
		argEntity *graph.ArgEntity,
		fields []*graph.Attribute,
		povitTableName string,
		ownerFieldName string,
		typeFieldName string,
		ids []uint64,
	) string
	BuildDeleteSQL(id uint64, tableName string) string
	BuildSoftDeleteSQL(id uint64, tableName string) string

	BuildQueryPovitSQL(povit *data.AssociationPovit) string
	BuildInsertPovitSQL(povit *data.AssociationPovit) string
	BuildCheckPovitSQL(povit *data.AssociationPovit) string
	BuildDeletePovitSQL(povit *data.AssociationPovit) string

	BuildTableCheckSQL(name string, database string) string
}

func GetSQLBuilder() SQLBuilder {
	var builder mysql.MySQLBuilder
	return &builder
}
