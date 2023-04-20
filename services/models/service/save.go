package service

import (
	"log"

	"github.com/codebdy/entify/model/data"
	"github.com/codebdy/entify/orm"
)

func (s *Service) Save(instances []*data.Instance) ([]orm.InsanceData, error) {
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

	for i := range instances {
		obj, err := session.SaveOne(instances[i])
		if err != nil {
			log.Println(err.Error())
			session.Dbx.Rollback()
			return nil, err
		}

		savedIds = append(savedIds, obj)
	}

	var result []orm.InsanceData
	if len(instances) > 0 {
		result = session.QueryByIds(instances[0].Entity, savedIds)
	}

	err = session.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	return result, nil

}

func (s *Service) SaveOne(instance *data.Instance) (interface{}, error) {
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

	id, err := session.SaveOne(instance)
	if err != nil {
		log.Println(err.Error())
		session.Dbx.Rollback()
		return nil, err
	}

	result := session.QueryOneById(instance.Entity, id)
	err = session.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	return result, nil
}

func (s *Service) InsertOne(instance *data.Instance) (interface{}, error) {
	instance.AsInsert()
	return s.SaveOne(instance)
}
