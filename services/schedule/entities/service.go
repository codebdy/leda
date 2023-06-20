package entities

import (
	"log"
	"reflect"

	"codebdy.com/leda/services/schedule/global"
	"github.com/codebdy/entify"
	"github.com/codebdy/leda-service-sdk/config"
)

func PostTask(task Task) {
	config := config.GetDbConfig()
	repo := entify.New(config)
	repo.Init(global.ServiceMeta.Content, global.ServiceMeta.Id)
	s, err := repo.OpenSession()
	if err != nil {
		log.Panic(err.Error())
	}
	taskMap, err := Struct2map(task)
	s.SaveOne(TASK_NAME, taskMap)
}

// 通过反射将struct转换成map
func Struct2map(obj any) (data map[string]any, err error) {
	// 通过反射将结构体转换成map
	data = make(map[string]any)
	objT := reflect.TypeOf(obj)
	objV := reflect.ValueOf(obj)
	for i := 0; i < objT.NumField(); i++ {
		fileName, ok := objT.Field(i).Tag.Lookup("json")
		if ok {
			data[fileName] = objV.Field(i).Interface()
		} else {
			data[objT.Field(i).Name] = objV.Field(i).Interface()
		}
	}
	return data, nil
}
