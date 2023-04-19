package meta

type MetaContent struct {
	Classes   []ClassMeta    `json:"classes"`
	Relations []RelationMeta `json:"relations"`
	Apis      []MethodMeta   `json:"apis"`
	Packages  []PackageMeta  `json:"packages"`
	Diagrams  []interface{}  `json:"diagrams"`
	X6Nodes   []interface{}  `json:"x6Nodes"`
	X6Edges   []interface{}  `json:"x6Edges"`
}
