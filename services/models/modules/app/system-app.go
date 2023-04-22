package app

import (
	"codebdy.com/leda/services/models/config"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify-graphql-schema/schema"
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
	metaConent := *meta.SystemMeta
	//mergedMetaConent := MergeServiceModels(&metaConent)
	repo := entify.New(config.GetDbConfig())
	repo.Init(metaConent, 0)
	schema := schema.New(repo)
	return &App{
		Schema: schema,
		//Parser: schema.Parser(),
		Repo: repo,
	}
}
