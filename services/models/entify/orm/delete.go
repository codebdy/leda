package orm

import (
	"log"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/db/dialect"
	"codebdy.com/leda/services/models/entify/model/data"
)

type InsanceData = map[string]interface{}

func (s *Session) clearSyncedAssociation(r *data.AssociationRef, ownerId uint64, synced []*data.Instance) {

	//查出所有关联实例
	associatedInstances := s.QueryAssociatedInstances(r, ownerId)

	for _, associatedIns := range associatedInstances {
		willBeDelete := true

		//找出需要被删除的
		for _, syncedIns := range synced {
			if syncedIns.Id != 0 && syncedIns.Id == associatedIns[consts.ID] {
				willBeDelete = false
				continue
			}
		}

		//删除需要被删除的
		if willBeDelete {
			//如果是组合，被关联实例
			if r.Association.IsCombination() {
				ins := data.NewInstance(associatedIns, r.Association.TypeEntity())
				s.DeleteInstance(ins)
			}
			s.deleteAssociationPovit(r, associatedIns[consts.ID].(uint64))
		}
	}
}
func (con *Session) clearAssociation(r *data.AssociationRef, ownerId uint64) {
	if r.Association.IsCombination() {
		con.deleteAssociatedInstances(r, ownerId)
	}
	con.deleteAssociationPovit(r, ownerId)
}

func (s *Session) checkAssociationPovit(r *data.AssociationRef, ownerId uint64) {

}

func (s *Session) deleteAssociationPovit(r *data.AssociationRef, ownerId uint64) {
	sqlBuilder := dialect.GetSQLBuilder()
	//先检查是否有数据，如果有再删除，避免死锁
	sql := sqlBuilder.BuildCheckAssociationSQL(ownerId, r.Table().Name, r.TypeColumn().Name)
	count := s.queryCount(sql)
	if count > 0 {
		sql = sqlBuilder.BuildClearAssociationSQL(ownerId, r.Table().Name, r.TypeColumn().Name)
		_, err := s.Dbx.Exec(sql)
		log.Println("deleteAssociationPovit SQL:" + sql)
		if err != nil {
			panic(err.Error())
		}
	}
}

func (s *Session) queryCount(countSql string) int64 {
	rows, err := s.Dbx.Query(countSql)
	defer rows.Close()
	if err != nil {
		log.Println(err.Error())
		return 0
	} else {
		var count int64
		for rows.Next() {
			rows.Scan(&count)
		}
		return count
	}
}

func (s *Session) deleteAssociatedInstances(r *data.AssociationRef, ownerId uint64) {
	typeEntity := r.TypeEntity()
	associatedInstances := s.QueryAssociatedInstances(r, ownerId)
	for i := range associatedInstances {
		ins := data.NewInstance(associatedInstances[i], typeEntity)
		s.DeleteInstance(ins)
	}
}

func (s *Session) DeleteAssociationPovit(povit *data.AssociationPovit) {
	sqlBuilder := dialect.GetSQLBuilder()
	sql := sqlBuilder.BuildDeletePovitSQL(povit)
	_, err := s.Dbx.Exec(sql)
	if err != nil {
		panic(err.Error())
	}
}

func (s *Session) DeleteInstance(instance *data.Instance) {
	var sql string
	sqlBuilder := dialect.GetSQLBuilder()
	tableName := instance.Table().Name
	if instance.Entity.IsSoftDelete() {
		sql = sqlBuilder.BuildSoftDeleteSQL(instance.Id, tableName)
	} else {
		sql = sqlBuilder.BuildDeleteSQL(instance.Id, tableName)
	}

	log.Println("DeleteInstance:", sql)
	_, err := s.Dbx.Exec(sql)
	if err != nil {
		panic(err.Error())
	}

	associstions := instance.Associations
	for i := range associstions {
		asso := associstions[i]
		if asso.Association.IsCombination() {
			if !asso.TypeEntity().IsSoftDelete() {
				s.deleteAssociationPovit(asso, instance.Id)
			}
			s.deleteAssociatedInstances(asso, instance.Id)
		}
	}
}
