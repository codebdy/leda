package app

import (
	"errors"
	"fmt"
	"log"
	"strconv"
	"sync"

	"github.com/mitchellh/mapstructure"
	"rxdrag.com/entify/model"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/meta"
	"rxdrag.com/entify/modules/app/schema"
	"rxdrag.com/entify/modules/app/schema/parser"
	"rxdrag.com/entify/orm"
	"rxdrag.com/entify/service"
)

//节省开支，运行时使用，初始化时请使用orm.IsEntityExists
var Installed = false

type App struct {
	AppId  uint64
	Model  *model.Model
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

var appLoaderCache sync.Map

func init() {
	//先加载系统APP
	if orm.IsEntityExists(meta.APP_ENTITY_NAME) {
		_, err := Get(meta.SYSTEM_APP_ID)
		if err != nil {
			log.Panic(err.Error())
		}
	}
}

func GetAppByIdArg(idArg interface{}) (*App, error) {
	if idArg == nil {
		err := errors.New("Nil app id")
		log.Panic(err.Error())
	}
	appIdStr := idArg.(string)
	appId, err := strconv.ParseUint(appIdStr, 10, 64)

	if err != nil {
		err := errors.New(fmt.Sprintf("App id error:%s", appIdStr))
		log.Panic(err.Error())
	}
	return Get(appId)
}

func Get(appId uint64) (*App, error) {
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
		if appId == meta.SYSTEM_APP_ID {
			model.SystemModel = appLoader.app.Model
		}
		return appLoader.app, nil
	}
}

func GetSystemApp() *App {
	if result, ok := appLoaderCache.Load(meta.SYSTEM_APP_ID); ok {
		loader := result.(*AppLoader)
		if !loader.loaded {
			loader.load(false)
		}
		return loader.app
	}

	return GetPredefinedSystemApp()
}

func GetPredefinedSystemApp() *App {

	metaConent := meta.SystemAppData["meta"].(meta.MetaContent)
	return &App{
		AppId: meta.SystemAppData["id"].(uint64),
		Model: model.New(&metaConent, meta.SYSTEM_APP_ID),
	}
}

func (a *App) GetEntityByName(name string) *graph.Entity {
	return a.Model.Graph.GetEntityByName(name)
}

func (a *App) GetEntityByInnerId(innerId uint64) *graph.Entity {
	return a.Model.Graph.GetEntityByInnerId(innerId)
}

func (a *App) ReLoad() {
	if result, ok := appLoaderCache.Load(a.AppId); ok {
		result.(*AppLoader).load(true)
	}
}

func NewApp(appId uint64) *App {
	systemApp := GetPredefinedSystemApp()
	s := service.NewSystem()
	appMeta := s.QueryById(
		systemApp.GetEntityByName(meta.APP_ENTITY_NAME),
		appId,
	)

	if appMeta != nil {
		publishedMeta := appMeta.(map[string]interface{})["publishedMeta"]
		var content *meta.MetaContent
		if publishedMeta != nil {
			content = DecodeContent(publishedMeta)
		}
		if appId != meta.SYSTEM_APP_ID {
			content = MergeSystemModel(content)
		}

		model := model.New(content, appId)
		schema := schema.New(model)

		return &App{
			AppId:  appId,
			Model:  model,
			Schema: schema,
			Parser: schema.Parser(),
		}
	}

	return nil
}

func DecodeContent(obj interface{}) *meta.MetaContent {
	content := meta.MetaContent{}
	if obj != nil {
		err := mapstructure.Decode(obj, &content)
		if err != nil {
			panic("Decode content failure:" + err.Error())
		}
	}
	return &content
}

func MergeSystemModel(content *meta.MetaContent) *meta.MetaContent {
	if content == nil {
		content = &meta.MetaContent{}
	}
	//合并系统Schema
	systemModel := GetSystemApp().Model
	for i := range systemModel.Meta.Classes {
		content.Classes = append(content.Classes, *systemModel.Meta.Classes[i])
	}

	for i := range systemModel.Meta.Relations {
		content.Relations = append(content.Relations, *systemModel.Meta.Relations[i])
	}
	return content
}
