package domain

import "codebdy.com/leda/services/entify/model/meta"

type Method struct {
	meta.MethodMeta
	Class *Class
}

func NewMethod(m *meta.MethodMeta, c *Class) *Method {
	return &Method{
		MethodMeta: *m,
		Class:      c,
	}
}
