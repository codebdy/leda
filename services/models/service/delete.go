package service

import (
	"log"

	"github.com/codebdy/entify/model/data"
)

func (s *Service) DeleteInstances(instances []*data.Instance) (interface{}, error) {
	session, err := s.repository.OpenSession()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	err = session.BeginTx()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	defer session.ClearTx()

	deletedIds := []interface{}{}

	for i := range instances {
		instance := instances[i]
		session.DeleteInstance(instance)
		deletedIds = append(deletedIds, instance.Id)
	}

	err = session.Dbx.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	return deletedIds, nil
}

func (s *Service) DeleteInstance(instance *data.Instance) (interface{}, error) {
	session, err := s.repository.OpenSession()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	err = session.BeginTx()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	defer session.ClearTx()
	session.DeleteInstance(instance)

	err = session.Dbx.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	return instance.ValueMap, nil
}
