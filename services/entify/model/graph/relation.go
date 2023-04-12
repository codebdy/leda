package graph

import (
	"codebdy.com/leda/services/entify/model/domain"
	"codebdy.com/leda/services/entify/model/meta"
	"codebdy.com/leda/services/entify/model/table"
	"codebdy.com/leda/services/entify/utils"
)

type Relation struct {
	AppId                  uint64
	Uuid                   string
	InnerId                uint64
	RelationType           string
	SourceEntity           *Entity
	TargetEntity           *Entity
	RoleOfTarget           string
	RoleOfSource           string
	DescriptionOnSource    string
	DescriptionOnTarget    string
	SourceMutiplicity      string
	TargetMultiplicity     string
	EnableAssociaitonClass bool
	AssociationClass       meta.AssociationClass
	Table                  *table.Table
}

func NewRelation(
	r *domain.Relation,
	sourceEntity *Entity,
	targetEntity *Entity,
) *Relation {
	roleOfTarget := r.RoleOfTarget
	roleOfSource := r.RoleOfSource

	if sourceEntity.Uuid() != r.Source.Uuid {
		roleOfSource = roleOfSource + "Of" + utils.FirstUpper(sourceEntity.Name())
	}

	if targetEntity.Uuid() != r.Target.Uuid {
		roleOfTarget = roleOfTarget + "Of" + utils.FirstUpper(targetEntity.Name())
	}

	relation := &Relation{
		Uuid:                   r.Uuid,
		InnerId:                r.InnerId,
		RelationType:           r.RelationType,
		SourceEntity:           sourceEntity,
		TargetEntity:           targetEntity,
		RoleOfTarget:           roleOfTarget,
		RoleOfSource:           roleOfSource,
		DescriptionOnSource:    r.DescriptionOnSource,
		DescriptionOnTarget:    r.DescriptionOnTarget,
		SourceMutiplicity:      r.SourceMutiplicity,
		TargetMultiplicity:     r.TargetMultiplicity,
		EnableAssociaitonClass: r.EnableAssociaitonClass,
		AssociationClass:       r.AssociationClass,
		AppId:                  r.AppId,
	}

	return relation
}
