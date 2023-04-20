package service

import (
	"context"

	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/graph"
)

type Service struct {
	isSystem   bool
	ctx        context.Context
	roleIds    []uint64
	repository *entify.Repository
}

func New(ctx context.Context, repository *entify.Repository) *Service {

	return &Service{
		isSystem:   false,
		ctx:        ctx,
		repository: repository,
		//roleIds:  QueryRoleIds(ctx, model),
	}
}

func NewSystem(repository *entify.Repository) *Service {
	return &Service{
		isSystem: true,
	}
}

// func (s *Service) me() *auth.User {
// 	return contexts.Values(s.ctx).Me
// }

// func (s *Service) appId() uint64 {
// 	return contexts.Values(s.ctx).AppId
// }

func (s *Service) canReadEntity(entityName string) (bool, graph.QueryArg) {
	whereArgs := map[string]interface{}{}
	return true, whereArgs
	// if s.isSystem || (s.me() != nil && (s.me().IsSupper || s.me().IsDemo)) {
	// 	return true, whereArgs
	// }
	// session, err := orm.Open()
	// if err != nil {
	// 	log.Println(err.Error())
	// }

	// appArg := graph.QueryArg{
	// 	"app": map[string]interface{}{
	// 		consts.ID: map[string]interface{}{
	// 			consts.ARG_EQ: s.appId(),
	// 		},
	// 	},
	// }

	// classUuidArg := graph.QueryArg{
	// 	"classUuid": map[string]interface{}{
	// 		consts.ARG_EQ: entity.Uuid(),
	// 	},
	// }

	// roleIdsArg := graph.QueryArg{
	// 	"roleId": map[string]interface{}{
	// 		consts.ARG_IN: s.roleIds,
	// 	},
	// }

	// authEntity := s.model.GetEntityByName("ClassAuthConfig")
	// result := session.Query(authEntity,
	// 	graph.QueryArg{
	// 		consts.ARG_AND: []graph.QueryArg{
	// 			appArg,
	// 			roleIdsArg,
	// 			classUuidArg,
	// 		},
	// 	},
	// 	authEntity.AllAttributes(),
	// )

	// canRead := false
	// orArgs := []graph.QueryArg{}
	// for _, classAuthCfg := range result.Nodes {
	// 	if classAuthCfg["canRead"] != nil && classAuthCfg["canRead"].(bool) {
	// 		canRead = true
	// 	}

	// 	if classAuthCfg["readExpression"] != nil {
	// 		readExpression := classAuthCfg["readExpression"].(string)

	// 		var expressionArgs graph.QueryArg
	// 		err := json.Unmarshal([]byte(readExpression), &expressionArgs)
	// 		if err != nil {
	// 			log.Panic(err.Error())
	// 		}

	// 		orArgs = append(orArgs, expressionArgs)
	// 	}
	// }

	// if len(orArgs) > 0 {
	// 	whereArgs[consts.ARG_OR] = orArgs
	// }

	//return canRead, whereArgs
}

// func QueryRoleIds(ctx context.Context, model *graph.Model) []uint64 {
// 	ids := []uint64{
// 		consts.GUEST_ROLE_ID,
// 	}

// 	me := contexts.Values(ctx).Me

// 	if me == nil {
// 		return ids
// 	}

// 	session, err := orm.Open()
// 	if err != nil {
// 		log.Panic(err.Error())
// 	}

// 	roleEntity := model.GetEntityByName(meta.ROLE_ENTITY_NAME)
// 	result := session.Query(roleEntity,
// 		map[string]interface{}{
// 			"users": map[string]interface{}{
// 				"id": map[string]interface{}{
// 					consts.ARG_EQ: me.Id,
// 				},
// 			},
// 		},
// 		roleEntity.AllAttributes(),
// 	)

// 	for _, role := range result.Nodes {
// 		ids = append(ids, role[consts.ID].(uint64))
// 	}

// 	return ids
// }
