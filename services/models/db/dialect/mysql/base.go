package mysql

import (
	"fmt"
)

func (*MySQLBuilder) BuildCreateMetaSQL() string {
	return `CREATE TABLE meta (
		id bigint NOT NULL AUTO_INCREMENT,
		appUuid varchar(255) DEFAULT NULL,
		content json DEFAULT NULL,
		publishedAt datetime DEFAULT NULL,
		createdAt datetime DEFAULT NULL,
		updatedAt datetime DEFAULT NULL,
		status varchar(45) DEFAULT NULL,
		PRIMARY KEY (id)
	) ENGINE=InnoDB AUTO_INCREMENT=1507236403010867251 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
	`
}

func (b *MySQLBuilder) BuildTableCheckSQL(name string, database string) string {
	return fmt.Sprintf(
		"SELECT COUNT(*) FROM information_schema.TABLES WHERE table_name ='%s' AND table_schema ='%s'",
		name,
		database,
	)
}

func nullableString(nullable bool) string {
	if nullable {
		return " NULL "
	}
	return " NOT NULL "
}
