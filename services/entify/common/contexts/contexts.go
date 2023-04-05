package contexts

import (
	"context"

	"rxdrag.com/entify/common/auth"
	"rxdrag.com/entify/consts"
)

type ContextValues struct {
	Token string
	Me    *auth.User
	AppId uint64
	Host  string
	IP    string
}

func Values(ctx context.Context) ContextValues {
	values := ctx.Value(consts.CONTEXT_VALUES)
	if values == nil {
		panic("Not set CONTEXT_VALUES in context")
	}
	return values.(ContextValues)
}
