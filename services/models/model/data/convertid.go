package data

import (
	"strconv"

	"codebdy.com/leda/services/models/consts"
)

func ConvertId(id interface{}) uint64 {
	switch id.(type) {
	case string:
		id, err := strconv.ParseUint(id.(string), 10, 64)
		if err != nil {
			panic("Convert id error:" + err.Error())
		}
		return id
	}

	return id.(uint64)
}

func ConvertObjectId(object map[string]interface{}) map[string]interface{} {
	if object[consts.ID] == nil {
		return object
	}
	switch object[consts.ID].(type) {
	case string:
		id, err := strconv.ParseUint(object[consts.ID].(string), 10, 64)
		if err != nil {
			panic("Convert id error:" + err.Error())
		}

		object[consts.ID] = id
	}

	return object
}
