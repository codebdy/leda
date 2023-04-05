package script

import (
	"bytes"
	"io/ioutil"
	"log"
	"net/http"
)

func FetchFn(url string, options map[string]interface{}) string {
	method := http.MethodGet
	if options != nil && options["method"] != nil {
		method = options["method"].(string)
	}

	reqBody := []byte("")
	if options != nil && options["body"] != nil {
		reqBody = []byte(options["body"].(string))
	}
	client := &http.Client{}
	req, err := http.NewRequest(method, url, bytes.NewBuffer(reqBody))

	if err != nil {
		log.Println(err)
		return ""
	}
	if options != nil && options["headers"] != nil {
		headers := options["headers"].(map[string]interface{})
		for key, header := range headers {
			if header != nil {
				req.Header.Add(key, header.(string))
			}
		}
	}

	res, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return ""
	}
	defer res.Body.Close()

	body, err := ioutil.ReadAll(res.Body)
	if err != nil {
		log.Println(err)
		return ""
	}
	return string(body)
}
