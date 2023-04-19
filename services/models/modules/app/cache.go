package app

import (
	"sync"
)

var appLoaderCache sync.Map

func ReloadApp(appId uint64) {
	if appLoader, ok := appLoaderCache.Load(appId); ok {
		appLoader.(*AppLoader).load(true)
	}
}

func ReloadAllApps() {
	appLoaderCache.Range(func(key interface{}, value interface{}) bool {
		value.(*AppLoader).load(true)
		return true
	})
}
