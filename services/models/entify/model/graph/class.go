package graph

import (
	"fmt"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/entify/model/domain"
	"codebdy.com/leda/services/models/leda-shared/utils"

	"github.com/gertd/go-pluralize"
)

type Class struct {
	attributes   []*Attribute
	associations []*Association
	Domain       *domain.Class
}

func NewClass(c *domain.Class) *Class {
	cls := Class{
		Domain:     c,
		attributes: make([]*Attribute, len(c.Attributes)),
	}

	for i := range c.Attributes {
		cls.attributes[i] = NewAttribute(c.Attributes[i], &cls)
	}

	return &cls
}

func (c *Class) Uuid() string {
	return c.Domain.Uuid
}

func (c *Class) InnerId() uint64 {
	return c.Domain.InnerId
}

func (c *Class) Name() string {
	return c.Domain.Name
}

func (c *Class) Description() string {
	return c.Domain.Description
}

func (c *Class) AddAssociation(a *Association) {
	c.associations = append(c.associations, a)
}

func (c *Class) TableName() string {
	name := utils.SnakeString(c.Domain.Name)
	if c.Domain.AppId == 0 {
		return name
	}
	return fmt.Sprintf("%s%d_%s", consts.TABLE_PREFIX, c.Domain.AppId, name)
}

func (c *Class) IsSoftDelete() bool {
	return c.Domain.SoftDelete
}

func (c *Class) QueryName() string {
	pluralize := pluralize.NewClient()
	return utils.FirstLower(pluralize.Plural(c.Name()))
}

func (c *Class) QueryOneName() string {
	return consts.ONE + utils.FirstUpper(c.Name())
}

func (c *Class) QueryAggregateName() string {
	return utils.FirstLower(c.Name()) + utils.FirstUpper(consts.AGGREGATE)
}

func (c *Class) DeleteName() string {
	return consts.DELETE + utils.FirstUpper(c.Name())
}

func (c *Class) DeleteByIdName() string {
	return consts.DELETE + utils.FirstUpper(c.Name()) + consts.BY_ID
}

func (c *Class) SetName() string {
	return consts.SET + utils.FirstUpper(c.Name())
}

func (c *Class) UpsertName() string {
	return consts.UPSERT + utils.FirstUpper(c.Name())
}

func (c *Class) UpsertOneName() string {
	return consts.UPSERT_ONE + utils.FirstUpper(c.Name())
}

func (c *Class) AggregateName() string {
	return c.Name() + utils.FirstUpper(consts.AGGREGATE)
}

func (c *Class) ListName() string {
	return c.Name() + utils.FirstUpper(consts.LIST)
}
