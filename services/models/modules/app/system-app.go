package app

import (
	"codebdy.com/leda/services/models/config"
	"codebdy.com/leda/services/models/modules/app/schema"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model/meta"
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
	repo := entify.New(config.GetDbConfig())
	repo.Init(*mergedMetaConent, 0)
	schema := schema.New(repo)
	return &App{
		Schema: schema,
		Parser: schema.Parser(),
		Repo:   repo,
	}
}
