package repository

import (
	"encoding/json"

	"github.com/graphql-go/graphql"
	"github.com/mitchellh/mapstructure"
	"rxdrag.com/entify/common/auth"
	"rxdrag.com/entify/common/contexts"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/meta"
)

type AbilityVerifier struct {
	me        *auth.User
	RoleIds   []interface{}
	Abilities []*auth.Ability
	// expression Key : 从Auth模块返回的结果
	//QueryUserCache map[string][]common.User
	isSupper bool
}

func (r *Repository) MakeVerifier() {
	verifier := AbilityVerifier{
		//Model: r.Model.Graph,
	}

	r.V = &verifier
}

func (r *Repository) MakeSupperVerifier() {
	verifier := AbilityVerifier{isSupper: true}

	r.V = &verifier
}

func (r *Repository) InitVerifier(p graphql.ResolveParams, entityUuids []interface{}) {
	me := contexts.Values(p.Context).Me
	r.V.me = me
	if me != nil {
		for i := range me.Roles {
			r.V.RoleIds = append(r.V.RoleIds, me.Roles[i].Id)
		}
	} else {
		r.V.RoleIds = append(r.V.RoleIds, consts.GUEST_ROLE_ID)
	}

	appUuid := contexts.Values(p.Context).AppId

	r.queryRolesAbilities(entityUuids, appUuid)
}

func (v *AbilityVerifier) IsSupper() bool {
	if v.isSupper {
		return true
	}

	if v.me != nil {
		return v.me.IsSupper
	}

	return false
}

func (v *AbilityVerifier) IsDemo() bool {
	if v.me != nil {
		return v.me.IsDemo
	}

	return false
}

func (v *AbilityVerifier) WeaveAuthInArgs(entityUuid string, args interface{}) interface{} {
	if v.IsSupper() || v.IsDemo() {
		return args
	}

	var rootAnd []map[string]interface{}

	if args == nil {
		rootAnd = []map[string]interface{}{}
	} else {
		argsMap := args.(map[string]interface{})
		if argsMap[consts.ARG_AND] == nil {
			rootAnd = []map[string]interface{}{}
		} else {
			rootAnd = argsMap[consts.ARG_AND].([]map[string]interface{})
		}
	}

	// if len(v.Abilities) == 0 && !v.IsSupper() && !v.IsDemo() {
	// 	rootAnd = append(rootAnd, map[string]interface{}{
	// 		consts.ID: map[string]interface{}{
	// 			consts.ARG_EQ: 0,
	// 		},
	// 	})

	// 	return map[string]interface{}{
	// 		consts.ARG_AND: rootAnd,
	// 	}
	// }

	expArg := v.queryEntityArgsMap(entityUuid)
	if len(expArg) > 0 {
		rootAnd = append(rootAnd, expArg)
	}

	if args == nil {
		return map[string]interface{}{
			consts.ARG_AND: rootAnd,
		}
	} else {
		argsMap := args.(map[string]interface{})
		argsMap[consts.ARG_AND] = rootAnd
		return argsMap
	}
}

func (v *AbilityVerifier) CanReadEntity(entityUuid string) bool {
	if v.IsSupper() || v.IsDemo() {
		return true
	}

	for _, ability := range v.Abilities {
		if ability.EntityUuid == entityUuid &&
			ability.ColumnUuid == "" &&
			ability.Can &&
			ability.AbilityType == meta.META_ABILITY_TYPE_READ {
			return true
		}
	}
	return false
}

func (v *AbilityVerifier) EntityMutationCan(entityData map[string]interface{}) bool {
	return false
}

func (v *AbilityVerifier) FieldCan(entityData map[string]interface{}) bool {
	return false
}

func (v *AbilityVerifier) queryEntityArgsMap(entityUuid string) map[string]interface{} {
	expMap := map[string]interface{}{}
	queryEntityExpressions := []string{}

	for _, ability := range v.Abilities {
		if ability.EntityUuid == entityUuid &&
			ability.ColumnUuid == "" &&
			ability.Can &&
			ability.AbilityType == meta.META_ABILITY_TYPE_READ &&
			ability.Expression != "" {
			queryEntityExpressions = append(queryEntityExpressions, ability.Expression)
		}
	}
	if len(queryEntityExpressions) > 0 {
		expMap[consts.ARG_OR] = expressionArrayToArgs(queryEntityExpressions)
	}
	return expMap
}

func expressionToKey(expression string) string {
	return ""
}

func expressionArrayToArgs(expressionArray []string) []map[string]interface{} {
	var args []map[string]interface{}
	for _, expression := range expressionArray {
		args = append(args, expressionToArg(expression))
	}
	return args
}

func expressionToArg(expression string) map[string]interface{} {
	arg := map[string]interface{}{}
	err := json.Unmarshal([]byte(expression), &arg)
	if err != nil {
		panic("Parse authorization expression error:" + err.Error())
	}
	return arg
}

func (r *Repository) queryRolesAbilities(entityUuids []interface{}, appUuid string) {
	abilitiyListResponse := r.QueryEntity(r.Model.Graph.GetEntityByUuid(consts.ABILITY_UUID), graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			"roleId": graph.QueryArg{
				consts.ARG_IN: r.V.RoleIds,
			},
			// "abilityType": QueryArg{
			// 	consts.ARG_EQ: v.AbilityType,
			// },
			"entityUuid": graph.QueryArg{
				consts.ARG_IN: entityUuids,
			},
		},
	})

	abilities := abilitiyListResponse[consts.NODES].([]InsanceData)

	for _, abilityMap := range abilities {
		var ability auth.Ability
		err := mapstructure.Decode(abilityMap, &ability)
		if err != nil {
			panic(err.Error())
		}
		r.V.Abilities = append(r.V.Abilities, &ability)
	}
}

func (r *Repository) MakeInterfaceAbilityVerifier(p graphql.ResolveParams, intf *graph.Interface) {
	r.MakeVerifier()
	var uuids []interface{}
	for i := range intf.Children {
		uuids = append(uuids, intf.Children[i].Uuid())
	}
	r.InitVerifier(p, uuids)
}

func (r *Repository) MakeEntityAbilityVerifier(p graphql.ResolveParams, entityUuid interface{}) {
	r.MakeVerifier()
	r.InitVerifier(p, []interface{}{entityUuid})
}

func (r *Repository) MakeAssociAbilityVerifier(p graphql.ResolveParams, association *graph.Association) {
	r.MakeVerifier()
	r.InitVerifier(p, []interface{}{association.TypeEntity().Uuid()})
}
