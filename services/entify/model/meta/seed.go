package meta

import (
	"encoding/json"
	"io/ioutil"
	"log"
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

var SystemMeta *MetaContent
var DefualtAuthServiceMeta *MetaContent

func init() {
	content := ReadContentFromJson("./seeds/system-meta.json")
	SystemMeta = &content

	authContent := ReadContentFromJson("./seeds/auth-meta.json")
	DefualtAuthServiceMeta = &authContent
}
