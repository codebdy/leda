package contexts

import (
	"context"

	"codebdy.com/leda/services/entify/consts"
)

type ContextValues struct {
	Token   string
	AppId   uint64
	AppName string
	Host    string
	IP      string
}

func Values(ctx context.Context) ContextValues {
	values := ctx.Value(consts.CONTEXT_VALUES)
	if values == nil {
		panic("Not set CONTEXT_VALUES in context")
	}
	return values.(ContextValues)
}
