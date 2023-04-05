package script

import (
	"github.com/dop251/goja"
	"rxdrag.com/entify/model"
)

func Enable(vm *goja.Runtime) {
	vm.Set("log", Log)
	vm.Set("iFetch", FetchFn)
	vm.Set("writeToCache", WriteToCache)
	vm.Set("readFromCache", ReadFromCache)
}

func GetCodes(model *model.Model) string {
	codeStr := ""
	for i := range model.Meta.Codes {
		code := model.Meta.Codes[i]
		codeStr = "\n" + code.Script
	}
	return codeStr
}

func GetCommonCodes() string {
	return `
	const debug = {}
	debug.log = log
	`
}
