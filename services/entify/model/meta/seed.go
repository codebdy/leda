package meta

import (
	"encoding/json"
	"io/ioutil"
	"log"

	"codebdy.com/leda/services/entify/consts"
)

func readContentFromJson() MetaContent {
	data, err := ioutil.ReadFile("./seeds/system-meta.json")
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
	content := readContentFromJson()
	SystemMeta = map[string]interface{}{
		"id":                          0,
		consts.META_CONTENT:           content,
		consts.META_PUBLISHED_CONTENT: content,
	}
}
