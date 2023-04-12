package graph

import (
	"codebdy.com/leda/services/entify/model/domain"
)

type Enum struct {
	domain.Enum
}

func NewEnum(e *domain.Enum) *Enum {
	return &Enum{Enum: *e}
}
