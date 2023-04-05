package authentication

import (
	"log"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/common/contexts"
	"rxdrag.com/entify/common/errorx"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/modules/app"
	"rxdrag.com/entify/service"
	"rxdrag.com/entify/utils"
)

func resolveMe(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()
	me := contexts.Values(p.Context).Me
	if me == nil {
		return nil, errorx.New(errorx.CODE_LOGIN_EXPIRED, "Login expired!")
	}
	return me, nil
}

func resolveRoleIds(p graphql.ResolveParams) (interface{}, error) {
	defer utils.PrintErrorStack()
	ids := []uint64{
		consts.GUEST_ROLE_ID,
	}

	//没有安装
	if !app.Installed {
		return ids, nil
	}

	me := contexts.Values(p.Context).Me

	if me == nil || contexts.Values(p.Context).AppId == 0 {
		return ids, nil
	}

	app, err := app.Get(contexts.Values(p.Context).AppId)
	if err != nil {
		log.Panic(err.Error())
	}

	return service.QueryRoleIds(p.Context, app.Model.Graph), nil

}
