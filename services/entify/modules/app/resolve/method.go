package resolve

import (
	"encoding/json"
	"fmt"
	"log"

	"github.com/dop251/goja"
	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/common/contexts"
	"rxdrag.com/entify/model"
	"rxdrag.com/entify/model/meta"
	"rxdrag.com/entify/modules/app/script"
	"rxdrag.com/entify/utils"
)

func MethodResolveFn(code string, methodArgs []meta.ArgMeta, model *model.Model) graphql.FieldResolveFn {
	return func(p graphql.ResolveParams) (interface{}, error) {
		defer utils.PrintErrorStack()
		scriptService := script.NewService(p.Context, model.Graph)
		vm := goja.New()
		script.Enable(vm)

		me := contexts.Values(p.Context).Me
		var meMap map[string]interface{}

		if me != nil {
			marshalContent, err := json.Marshal(me)
			if err != nil {
				log.Panic(err)
			}
			json.Unmarshal(marshalContent, &meMap)
		}

		vm.Set("$args", p.Args)
		vm.Set("$beginTx", scriptService.BeginTx)
		vm.Set("$clearTx", scriptService.ClearTx)
		vm.Set("$commit", scriptService.Commit)
		vm.Set("$rollback", scriptService.Rollback)
		vm.Set("$save", scriptService.Save)
		vm.Set("$saveOne", scriptService.SaveOne)
		vm.Set("$log", scriptService.WriteLog)
		vm.Set("$notice", scriptService.EmitNotification)
		vm.Set("$query", scriptService.Query)
		vm.Set("$me", meMap)
		vm.Set("$appId", contexts.Values(p.Context).AppId)
		script.Enable(vm)
		funcStr := fmt.Sprintf(
			`
			%s
			%s
			`,
			script.GetCodes(model),
			code,
		)

		result, err := vm.RunString(funcStr)
		if err != nil {
			panic(err)
		}
		return result.Export(), nil
	}
}
