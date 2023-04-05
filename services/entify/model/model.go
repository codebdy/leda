package model

import (
	"rxdrag.com/entify/model/domain"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/meta"
)

type Model struct {
	Meta   *meta.Model
	Domain *domain.Model
	Graph  *graph.Model
}

func New(c *meta.MetaContent, appid uint64) *Model {
	metaModel := meta.New(c, appid)
	domainModel := domain.New(metaModel)
	grahpModel := graph.New(domainModel)
	model := Model{
		Meta:   metaModel,
		Domain: domainModel,
		Graph:  grahpModel,
	}
	return &model
}

var SystemModel *Model
