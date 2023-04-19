package app

import (
	"codebdy.com/leda/services/models/model"
	"codebdy.com/leda/services/models/model/meta"
	"codebdy.com/leda/services/models/modules/app/schema"
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
	//赋值一份数据合并，不要在原来的基础上修改
	metaConent := *meta.SystemMeta
	mergedMetaConent := MergeServiceModels(&metaConent)
	model := model.New(mergedMetaConent, 0)
	schema := schema.New(model)
	return &App{
		Schema: schema,
		Parser: schema.Parser(),
		Model:  model,
	}
}
