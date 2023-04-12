package meta

const (
	INHERIT             string = "inherit"
	TWO_WAY_ASSOCIATION string = "twoWayAssociation"
	TWO_WAY_AGGREGATION string = "twoWayAggregation"
	TWO_WAY_COMBINATION string = "twoWayCombination"
	ONE_WAY_ASSOCIATION string = "oneWayAssociation"
	//ONE_WAY_AGGREGATION string = "oneWayAggregation"
	ONE_WAY_COMBINATION string = "oneWayCombination"

	ZERO_ONE  string = "0..1"
	ZERO_MANY string = "0..*"
)

type AssociationClass struct {
	Name       string          `json:"name"`
	Attributes []AttributeMeta `json:"attributes"`
}

type RelationMeta struct {
	Uuid                   string           `json:"uuid"`
	InnerId                uint64           `json:"innerId"`
	RelationType           string           `json:"relationType"`
	SourceId               string           `json:"sourceId"`
	TargetId               string           `json:"targetId"`
	RoleOfTarget           string           `json:"roleOfTarget"`
	RoleOfSource           string           `json:"roleOfSource"`
	LabelOfTarget          string           `json:"labelOfTarget"`
	LabelOfSource          string           `json:"labelOfSource"`
	DescriptionOnSource    string           `json:"descriptionOnSource"`
	DescriptionOnTarget    string           `json:"descriptionOnTarget"`
	SourceMutiplicity      string           `json:"sourceMutiplicity"`
	TargetMultiplicity     string           `json:"targetMultiplicity"`
	EnableAssociaitonClass bool             `json:"enableAssociaitonClass"`
	AssociationClass       AssociationClass `json:"associationClass"`
	System                 bool             `json:"system"`
	AppId                  uint64
}

func (r *RelationMeta) IsAbsract(m *Model) bool {
	if m.GetAbstractClassByUuid(r.SourceId) != nil || m.GetAbstractClassByUuid(r.TargetId) != nil {
		return true
	}
	return false
}
