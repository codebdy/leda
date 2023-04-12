package script

import (
	"context"
	"log"

	"codebdy.com/leda/services/entify/common/contexts"
	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/logs"
	"codebdy.com/leda/services/entify/model/data"
	"codebdy.com/leda/services/entify/model/graph"
	"codebdy.com/leda/services/entify/model/observer"
	"codebdy.com/leda/services/entify/modules/register"
	"codebdy.com/leda/services/entify/orm"
	"codebdy.com/leda/services/entify/service"
	"github.com/graphql-go/graphql"
)

type ScriptService struct {
	ctx     context.Context
	roleIds []uint64
	model   *graph.Model
	session *orm.Session
}

func NewService(ctx context.Context, model *graph.Model) *ScriptService {

	return &ScriptService{
		ctx:     ctx,
		model:   model,
		roleIds: service.QueryRoleIds(ctx, model),
	}
}

func (s *ScriptService) SetSession(session *orm.Session) {
	s.session = session
}

func (s *ScriptService) BeginTx() {
	session, err := orm.Open()
	if err != nil {
		log.Panic(err.Error())
	}
	s.session = session
	err = session.BeginTx()
	if err != nil {
		log.Panic(err.Error())
	}
}

func (s *ScriptService) Commit() {
	if s.session == nil {
		log.Panic("No session to commit")
	}
	err := s.session.Commit()

	if err != nil {
		log.Panic(err.Error())
	}
}

func (s *ScriptService) ClearTx() {
	if s.session == nil {
		log.Panic("No session to ClearTx")
	}
	s.session.ClearTx()
	s.session = nil
}

func (s *ScriptService) Rollback() {
	if s.session == nil {
		log.Panic("No session to Rollback")
	}

	err := s.session.Dbx.Rollback()
	if err != nil {
		log.Panic(err.Error())
	}
	s.session = nil
}

func (s *ScriptService) checkSession() {
	if s.session == nil {
		session, err := orm.Open()
		if err != nil {
			log.Panic(err.Error())
		}
		s.session = session
	}
}

func (s *ScriptService) Save(objects []interface{}, entityName string) []orm.InsanceData {
	s.checkSession()
	entity := s.model.GetEntityByName(entityName)

	if entity == nil {
		log.Panic("Can not find entity by name:" + entityName)
	}

	savedIds := []interface{}{}
	for i := range objects {
		object := objects[i]
		data.ConvertObjectId(object.(map[string]interface{}))
		instance := data.NewInstance(object.(map[string]interface{}), entity)
		obj, err := s.session.SaveOne(instance)
		if err != nil {
			log.Panic(err.Error())
		}
		savedIds = append(savedIds, obj)
	}
	if len(savedIds) > 0 {
		objects := s.session.QueryByIds(entity, savedIds)
		observer.EmitObjectMultiPosted(objects, entity, s.ctx)
	}

	return []orm.InsanceData{}
}

func (s *ScriptService) SaveOne(object interface{}, entityName string) interface{} {
	s.checkSession()
	entity := s.model.GetEntityByName(entityName)

	if entity == nil {
		log.Panic("Can not find entity by name:" + entityName)
	}

	if object == nil {
		log.Panic("Object to save is nil")
	}

	instance := data.NewInstance(object.(map[string]interface{}), entity)

	id, err := s.session.SaveOne(instance)
	if err != nil {
		log.Panic(err.Error())
	}

	result := s.session.QueryOneById(instance.Entity, id)
	observer.EmitObjectPosted(result.(map[string]interface{}), entity, s.ctx)
	return result
}

func (s *ScriptService) WriteLog(
	operate string,
	result string,
	message string,
) {
	logs.WriteBusinessLog(s.ctx, operate, result, message)
}

func (s *ScriptService) EmitNotification(text string, noticeType string, userId uint64) {
	s.SaveOne(
		map[string]interface{}{
			"text":       text,
			"noticeType": noticeType,
			"user": map[string]interface{}{
				"sync": map[string]interface{}{
					consts.ID: userId,
				},
			},
			"app": map[string]interface{}{
				"sync": map[string]interface{}{
					consts.ID: contexts.Values(s.ctx).AppId,
				},
			},
		},
		"Notification",
	)
}

func (s *ScriptService) Query(gql string, variables interface{}) interface{} {
	var newVariables map[string]interface{}

	if variables != nil {
		newVariables = variables.(map[string]interface{})
	}
	params := graphql.Params{
		Schema:         register.GetSchema(s.ctx),
		RequestString:  gql,
		VariableValues: newVariables,
		Context:        context.WithValue(s.ctx, "gql", gql),
	}

	r := graphql.Do(params)
	if len(r.Errors) > 0 {
		log.Printf("failed to execute graphql operation, errors: %+v", r.Errors)
		log.Panic(r.Errors[0].Error())
	}

	return r.Data
}
