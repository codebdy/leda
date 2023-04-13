package errorx

import (
	"encoding/json"
)

type Error struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func New(code, message string) Error {
	return Error{
		Code:    code,
		Message: message,
	}
}

func (e Error) Error() string {
	jsonByte, _ := json.Marshal(e)
	return string(jsonByte)
}
