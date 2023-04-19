package mysql

import (
	"errors"
	"fmt"
	"log"
	"strings"

	"codebdy.com/leda/services/models/entify/model/data"
	"codebdy.com/leda/services/models/entify/model/table"
)

func (b *MySQLBuilder) BuildUpdateSQL(id uint64, fields []*data.Field, table *table.Table) string {
	sql := fmt.Sprintf(
		"UPDATE `%s` SET %s WHERE ID = %d",
		table.Name,
		updateSetFields(fields),
		id,
	)

	return sql
}

func updateSetFields(fields []*data.Field) string {
	if len(fields) == 0 {
		log.Panic(errors.New("No update fields"))
	}
	columns := make([]string, len(fields))
	for i, field := range fields {
		columns[i] = field.Column.Name + "=?"
	}
	return strings.Join(columns, ",")
}
