package orm

import (
	"database/sql"
	"log"

	"rxdrag.com/entify/config"
	"rxdrag.com/entify/db"
	"rxdrag.com/entify/db/dialect"
)

type Session struct {
	idSeed int //use for sql join table
	//model  *model.Model
	Dbx *db.Dbx
}

func (c *Session) BeginTx() error {
	return c.Dbx.BeginTx()
}

func (c *Session) Commit() error {
	return c.Dbx.Commit()
}

func (c *Session) ClearTx() {
	c.Dbx.ClearTx()
}

//use for sql join table
func (c *Session) CreateId() int {
	c.idSeed++
	return c.idSeed
}

func (con *Session) doCheckEntity(name string) bool {
	sqlBuilder := dialect.GetSQLBuilder()
	var count int
	err := con.Dbx.QueryRow(sqlBuilder.BuildTableCheckSQL(name, config.GetDbConfig().Database)).Scan(&count)
	switch {
	case err == sql.ErrNoRows:
		return false
	case err != nil:
		log.Panic(err.Error())
	}
	return count > 0
}
