package meta

type OrchestrationMeta struct {
	Uuid        string    `json:"uuid"`
	Name        string    `json:"name"`
	Label       string    `json:"label"`
	Type        string    `json:"type"`
	TypeUuid    string    `json:"typeUuid"`
	TypeLabel   string    `json:"typeLabel"`
	Args        []ArgMeta `json:"args"`
	OperateType string    `json:"operateType"` //Mutation or Query
	Script      string    `json:"script"`
	Description string    `json:"description"`
	System      bool      `json:"system"`
}
