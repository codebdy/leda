package entities

type TaskConfig struct {
	RequestType string      `json:"requestType"`
	Url         string      `json:"url"`
	Gql         string      `json:"gql"`
	Params      interface{} `json:"params"`
	Headers     interface{} `json:"headers"`
}
