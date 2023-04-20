package service

import (
	"log"

	"github.com/codebdy/entify/shared"
)

func (s *Service) DeleteInstances(entityName string, ids []shared.ID) (interface{}, error) {
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

	for i := range ids {
		id := ids[i]
		session.DeleteInstance(entityName, id)
		deletedIds = append(deletedIds, id)
	}

	err = session.Dbx.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}

	return deletedIds, nil
}

func (s *Service) DeleteInstance(entityName string, id shared.ID) (interface{}, error) {
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
	session.DeleteInstance(entityName, id)

	err = session.Dbx.Commit()
	if err != nil {
		log.Println(err.Error())
		return nil, err
	}
	return map[string]interface{}{"id": id}, nil
}
