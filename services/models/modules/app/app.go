package app

import (
	"errors"
	"log"
	"sync"

	"codebdy.com/leda/services/models/config"
	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/modules/app/schema"
	"codebdy.com/leda/services/models/modules/app/schema/parser"
	"codebdy.com/leda/services/models/service"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/model"
	"github.com/codebdy/entify/model/graph"
	"github.com/codebdy/entify/model/meta"
	"github.com/codebdy/entify/shared"
)

//节省开支，运行时使用，初始化时请使用orm.IsEntityExists
var Installed = false

type App struct {
	MetaId uint64
	Repo   *entify.Repository
	Schema schema.AppGraphqlSchema
	Parser *parser.ModelParser
}

type AppLoader struct {
	appId  uint64
	app    *App
	loaded bool
	sync.Mutex
}

func (l *AppLoader) load(force bool) {
	l.Lock()
	defer l.Unlock()
	if !l.loaded || force {
		log.Println("加载", l.appId)
		l.app = NewApp(l.appId)
		if l.app == nil {
			log.Panic(errors.New("Cant load app"))
		}
		l.loaded = true
	}
}

func Get(appId uint64) (*App, error) {
	if appId == 0 {
		return GetSystemApp(), nil
	}

	if result, ok := appLoaderCache.Load(appId); ok {
		if !result.(*AppLoader).loaded {
			result.(*AppLoader).load(false)
		}
		return result.(*AppLoader).app, nil
	} else {
		appLoader := &AppLoader{
			appId:  appId,
			loaded: false,
		}
		appLoaderCache.Store(appId, appLoader)
		appLoader.load(false)
		if appId == 0 {
			model.SystemModel = appLoader.app.Repo.Model
		}
		return appLoader.app, nil
	}
}

func (a *App) GetEntityByName(name string) *graph.Entity {
	return a.Repo.Model.Graph.GetEntityByName(name)
}

func (a *App) GetEntityByInnerId(innerId uint64) *graph.Entity {
	return a.Repo.Model.Graph.GetEntityByInnerId(innerId)
}

func NewApp(metaId shared.ID) *App {
	systemApp := GetSystemApp()
	if metaId == 0 {
		return systemApp
	}

	s := service.NewSystem(systemApp.Repo)
	appData := s.QueryById(
		consts.APP_ENTITY_NAME,
		metaId,
	)

	if appData == nil {
		return nil
	}
	appMeta := s.QueryById(
		consts.META_ENTITY_NAME,
		appData.(map[string]interface{})["metaId"].(uint64),
	)

	if appMeta == nil {
		return nil
	}

	publishedMeta := appMeta.(map[string]interface{})[consts.META_PUBLISHED_CONTENT]
	var content *meta.UMLMeta
	if publishedMeta != nil {
		content = DecodeContent(publishedMeta)
	}

	//content = MergeServiceModels(content)
	repo := entify.New(config.GetDbConfig())
	repo.Init(*content, metaId)
	schema := schema.New(repo)

	return &App{
		MetaId: metaId,
		Repo:   repo,
		Schema: schema,
		Parser: schema.Parser(),
	}
}
