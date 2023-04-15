package app

import (
	"codebdy.com/leda/services/entify/model"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/modules/app/schema"
)

var sysApp *App

func GetSystemApp() *App {
	if sysApp == nil {
		sysApp = createPredefinedSystemApp()
	}

	return sysApp
}

func ReloadSystemApp() *App {
	sysApp = createPredefinedSystemApp()
	return sysApp
}

func createPredefinedSystemApp() *App {
	metaConent := meta.SystemMeta
	mergedMetaConent := MergeServiceModels(metaConent)
	model := model.New(mergedMetaConent, 0)
	schema := schema.New(model)
	return &App{
		Schema: schema,
		Parser: schema.Parser(),
		Model:  model,
	}
}
