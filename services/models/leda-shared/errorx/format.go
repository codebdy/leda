package errorx

import (
	"encoding/json"

	"github.com/graphql-go/graphql/gqlerrors"
)

func Format(err error) gqlerrors.FormattedError {
	errorMsg := err.Error()
	var code string
	if json.Valid([]byte(errorMsg)) {
		errorObj := map[string]interface{}{}
		json.Unmarshal([]byte(errorMsg), &errorObj)
		code = errorObj["code"].(string)
		errorMsg = errorObj["message"].(string)
	}

	if code != "" {
		return gqlerrors.FormattedError{
			Message: errorMsg,
			Extensions: map[string]interface{}{
				"code":        code,
				"specifiedBy": "https://github.com/rxdrag/entix/blob/main/error-code.md",
			},
		}
	} else {
		return gqlerrors.FormattedError{
			Message: errorMsg,
		}
	}

}
