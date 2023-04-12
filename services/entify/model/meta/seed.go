package meta

import (
	"encoding/json"
	"io/ioutil"
	"log"
)

func readContentFromJson() MetaContent {
	data, err := ioutil.ReadFile("./seeds/meta.json")
	content := MetaContent{}
	if nil != err {
		log.Panic(err.Error())
	} else {
		err = json.Unmarshal(data, &content)
	}

	return content
}

var SystemAppData map[string]interface{}

func init() {
	content := readContentFromJson()
	SystemAppData = map[string]interface{}{
		"id":            SYSTEM_APP_ID,
		"uuid":          "SYSTEM-APP-UUID",
		"title":         "Appx",
		"meta":          content,
		"publishedMeta": content,
	}
}
