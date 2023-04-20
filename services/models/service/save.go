package service

import (
	"log"

	"github.com/codebdy/entify/orm"
)

func (s *Service) Save(entityName string, objects []map[string]interface{}) ([]orm.InsanceData, error) {
	session, err := s.repository.OpenSession()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	err = session.BeginTx()
	defer session.ClearTx()
	if err != nil {
		log.Println(err.Error())
		session.Dbx.Rollback()
		return nil, err
	}
	savedIds := []interface{}{}

	for i := range objects {
		obj, err := session.SaveOne(entityName, objects[i])
		if err != nil {
			log.Println(err.Error())
			session.Dbx.Rollback()
			return nil, err
		}

		savedIds = append(savedIds, obj)
	}

	var result []orm.InsanceData
	if len(objects) > 0 {
		result = session.QueryByIds(entityName, savedIds)
	}

	err = session.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	return result, nil

}

func (s *Service) SaveOne(entityName string, object map[string]interface{}) (interface{}, error) {

	session, err := s.repository.OpenSession()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	err = session.BeginTx()
	defer session.ClearTx()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	id, err := session.SaveOne(entityName, object)
	if err != nil {
		log.Println(err.Error())
		session.Dbx.Rollback()
		return nil, err
	}

	result := session.QueryOneById(entityName, id)
	err = session.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	return result, nil
}
