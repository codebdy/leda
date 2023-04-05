package graph

import (
	"rxdrag.com/entify/model/domain"
)

type ThirdParty struct {
	Class
}

func NewThirdParty(c *domain.Class) *ThirdParty {
	return &ThirdParty{
		Class: *NewClass(c),
	}
}

func (t *ThirdParty) Attributes() []*Attribute {
	return t.attributes
}
