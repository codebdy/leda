package orm

import (
	"fmt"
	"log"

	"rxdrag.com/entify/db/dialect"
	"rxdrag.com/entify/model/data"
)

func (s *Session) SaveOne(instance *data.Instance) (uint64, error) {
	if instance.IsInsert() {
		return s.InsertOne(instance)
	} else {
		return s.UpdateOne(instance)
	}
}

func (s *Session) InsertOne(instance *data.Instance) (uint64, error) {
	id, err := s.insertOneBody(instance)

	if err != nil {
		return 0, err
	}
	for _, asso := range instance.Associations {
		err := s.SaveAssociation(asso, uint64(id))
		if err != nil {
			log.Println("Save reference failed:", err.Error())
			return 0, err
		}
	}

	// savedObject := s.QueryOneEntityById(instance.Entity, id)

	// if savedObject == nil {
	// 	log.Panic("query inserted instance failed", instance.Entity.Name(), id)
	// }
	return uint64(id), nil
}

//只保存属性，不保存关联
func (s *Session) insertOneBody(instance *data.Instance) (int64, error) {
	sqlBuilder := dialect.GetSQLBuilder()
	saveStr := sqlBuilder.BuildInsertSQL(instance.Fields, instance.Table())
	values := makeFieldValues(instance.Fields)
	result, err := s.Dbx.Exec(saveStr, values...)
	if err != nil {
		log.Panic("Insert data failed:", err.Error(), saveStr)
		return 0, err
	}

	id, err := result.LastInsertId()
	if err != nil {
		log.Println("LastInsertId failed:", err.Error())
		return 0, err
	}
	return id, nil
}

func (s *Session) UpdateOne(instance *data.Instance) (uint64, error) {

	instanceForUpdate := s.QueryOneById(instance.Entity, instance.Id)
	if instanceForUpdate == nil {
		log.Panic(fmt.Sprintf("Update instance is not exist, entity: %s, instanceId:%d", instance.Entity.Name(), instance.Id))
	}
	err := s.updateOneBody(instance)
	if err != nil {
		return 0, err
	}
	for _, ref := range instance.Associations {
		err = s.SaveAssociation(ref, instance.Id)
		if err != nil {
			return 0, err
		}
	}

	return instance.Id, nil
}

//只保存属性，不保存关联
func (s *Session) updateOneBody(instance *data.Instance) error {
	sqlBuilder := dialect.GetSQLBuilder()

	saveStr := sqlBuilder.BuildUpdateSQL(instance.Id, instance.Fields, instance.Table())
	values := makeFieldValues(instance.Fields)
	log.Println(saveStr)
	_, err := s.Dbx.Exec(saveStr, values...)
	if err != nil {
		log.Println("Update data failed:", err.Error())
		return err
	}

	return nil
}

func newAssociationPovit(r *data.AssociationRef, ownerId uint64, tarId uint64) *data.AssociationPovit {
	sourceId := ownerId
	targetId := tarId

	if !r.IsSource() {
		sourceId = targetId
		targetId = ownerId
	}

	return data.NewAssociationPovit(r, sourceId, targetId)

}

func (s *Session) saveAssociationInstance(ins *data.Instance) (uint64, error) {
	if !ins.IsEmperty() {
		saved, err := s.SaveOne(ins)
		if err != nil {
			return 0, err
		}

		return saved, nil
	}
	return ins.Id, nil
}
func (s *Session) SaveAssociation(r *data.AssociationRef, ownerId uint64) error {
	if r.Clear {
		s.clearAssociation(r, ownerId)
		return nil
	}

	synced := r.Synced
	if len(synced) != 0 {
		s.clearSyncedAssociation(r, ownerId, synced)
		s.saveAssociationInstances(synced, r, ownerId)
		return nil
	}

	for _, ins := range r.Deleted {
		if r.Cascade() {
			s.DeleteInstance(ins)
		} else {
			povit := newAssociationPovit(r, ownerId, ins.Id)
			s.DeleteAssociationPovit(povit)
		}
	}

	for _, ins := range r.Added {
		id, err := s.saveAssociationInstance(ins)

		if err != nil {
			log.Panic("Save Association error:" + err.Error())
		} else {
			if id != 0 {
				tarId := id
				relationInstance := newAssociationPovit(r, ownerId, tarId)
				if !s.povitExists(relationInstance) {
					s.SaveAssociationPovit(relationInstance)
				}
			} else {
				log.Panic("Save Association error, id is 0")
			}
		}
	}

	s.saveAssociationInstances(r.Updated, r, ownerId)

	return nil
}

func (s *Session) saveAssociationInstances(instances []*data.Instance, r *data.AssociationRef, ownerId uint64) {
	for _, ins := range instances {
		targetId := ins.Id
		id, err := s.saveAssociationInstance(ins)
		if err != nil {
			panic("Save Association error:" + err.Error())
		} else {
			if id != 0 {
				targetId = id
			} else {
				panic("Save Association error")
			}
		}
		relationInstance := newAssociationPovit(r, ownerId, targetId)
		if !s.povitExists(relationInstance) {
			s.SaveAssociationPovit(relationInstance)
		}
	}
}

func (s *Session) povitExists(p *data.AssociationPovit) bool {
	sqlBuilder := dialect.GetSQLBuilder()
	sqlStr := sqlBuilder.BuildCheckPovitSQL(p)
	count := s.queryCount(sqlStr)
	if count == 0 {
		return false
	}

	return true
}

func (s *Session) SaveAssociationPovit(povit *data.AssociationPovit) {
	sqlBuilder := dialect.GetSQLBuilder()
	sql := sqlBuilder.BuildQueryPovitSQL(povit)
	rows, err := s.Dbx.Query(sql)
	defer rows.Close()
	if err != nil {
		panic(err.Error())
	}
	if !rows.Next() {
		sql = sqlBuilder.BuildInsertPovitSQL(povit)
		_, err := s.Dbx.Exec(sql)
		if err != nil {
			panic(err.Error())
		}
	}
}
