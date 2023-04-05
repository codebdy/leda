package utils

import (
	"log"
	"strconv"
)

func Uint64Value(value interface{}) uint64 {
	if value == nil {
		return 0
	}

	intVal, err := strconv.ParseUint(value.(string), 10, 64)
	if err != nil {
		log.Panic("Uint64Value error")
	}
	return intVal
}

func StringValue(value interface{}) string {
	if value == nil {
		return ""
	}

	return value.(string)
}
