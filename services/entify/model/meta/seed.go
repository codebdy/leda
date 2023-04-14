package meta

import (
	"encoding/json"
	"io/ioutil"
	"log"

	"codebdy.com/leda/services/entify/consts"
)

func ReadContentFromJson(fileName string) MetaContent {
	data, err := ioutil.ReadFile(fileName)
	content := MetaContent{}
	if nil != err {
		log.Panic(err.Error())
	} else {
		err = json.Unmarshal(data, &content)
	}

	return content
}

var SystemMeta map[string]interface{}

func init() {
	content := ReadContentFromJson("./seeds/system-meta.json")
	SystemMeta = map[string]interface{}{
		"id":                          0,
		consts.META_CONTENT:           content,
		consts.META_PUBLISHED_CONTENT: content,
	}
}
