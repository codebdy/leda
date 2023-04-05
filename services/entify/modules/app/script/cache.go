package script

import "sync"

var cache sync.Map

func WriteToCache(key string, value interface{}) {
	cache.Store(key, value)
}

func ReadFromCache(key string) interface{} {
	if value, ok := cache.Load(key); ok {
		return value
	}
	return nil
}
