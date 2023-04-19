package mysql

import (
	"fmt"
	"time"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/entify/model/data"
)

func (b *MySQLBuilder) BuildDeleteSQL(id uint64, tableName string) string {
	sql := fmt.Sprintf(
		"DELETE FROM `%s` WHERE (`%s` = '%d')",
		tableName,
		"id",
		id,
	)
	return sql
}

func (b *MySQLBuilder) BuildSoftDeleteSQL(id uint64, tableName string) string {
	sql := fmt.Sprintf(
		"UPDATE `%s` SET `%s` = '%s' WHERE (`%s` = %d)",
		tableName,
		consts.DELETED_AT,
		time.Now(),
		"id",
		id,
	)
	return sql
}

func (b *MySQLBuilder) BuildDeletePovitSQL(povit *data.AssociationPovit) string {
	return fmt.Sprintf(
		"DELETE FROM `%s` WHERE (`%s` = %d AND `%s` = %d)",
		povit.Table().Name,
		povit.Source.Column.Name,
		povit.Source.Value,
		povit.Target.Column.Name,
		povit.Target.Value,
	)
}

func (b *MySQLBuilder) BuildCheckPovitSQL(povit *data.AssociationPovit) string {
	return fmt.Sprintf(
		"SELECT count(%s) from `%s` WHERE (`%s` = %d AND `%s` = %d)",
		povit.Source.Column.Name,
		povit.Table().Name,
		povit.Source.Column.Name,
		povit.Source.Value,
		povit.Target.Column.Name,
		povit.Target.Value,
	)
}

//删除前检查SQL
func (b *MySQLBuilder) BuildCheckAssociationSQL(ownerId uint64, tableName string, ownerFieldName string) string {
	sql := fmt.Sprintf(
		"SELECT count(%s) FROM `%s` WHERE (`%s` = '%d')",
		ownerFieldName,
		tableName,
		ownerFieldName,
		ownerId,
	)
	return sql
}

func (b *MySQLBuilder) BuildClearAssociationSQL(ownerId uint64, tableName string, ownerFieldName string) string {
	sql := fmt.Sprintf(
		"DELETE FROM `%s` WHERE (`%s` = '%d')",
		tableName,
		ownerFieldName,
		ownerId,
	)
	return sql
}
