package meta

const (
	QUERY    string = "query"
	MUTATION string = "mutation"
)

type ArgMeta struct {
	Uuid      string `json:"uuid"`
	Type      string `json:"type"`
	Name      string `json:"name"`
	TypeUuid  string `json:"typeUuid"`
	TypeLabel string `json:"typeLabel"`
}

type MethodMeta struct {
	Uuid        string    `json:"uuid"`
	Name        string    `json:"name"`
	Label       string    `json:"label"`
	Type        string    `json:"type"`
	TypeUuid    string    `json:"typeUuid"`
	TypeLabel   string    `json:"typeLabel"`
	Args        []ArgMeta `json:"args"`
	OperateType string    `json:"operateType"` //Mutation or Query
	Description string    `json:"description"`
}
