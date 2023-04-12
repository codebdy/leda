package entities

type TaskConfig struct {
	EntityId    int64       `json:"entityId"`
	RequestType string      `json:"requestType"`
	Url         string      `json:"url"`
	Gql         string      `json:"gql"`
	Params      interface{} `json:"params"`
}
