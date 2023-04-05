package meta

type MetaContent struct {
	Classes        []ClassMeta         `json:"classes"`
	Relations      []RelationMeta      `json:"relations"`
	Codes          []CodeMeta          `json:"codes"`
	Orchestrations []OrchestrationMeta `json:"orchestrations"`
	Packages       []PackageMeta       `json:"packages"`
	Diagrams       []interface{}       `json:"diagrams"`
	X6Nodes        []interface{}       `json:"x6Nodes"`
	X6Edges        []interface{}       `json:"x6Edges"`
}
