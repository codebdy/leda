package leda

import (
	"context"
)

type ModelsService struct {
	host string
}

func New(host string) ModelsService {
	if host == "" {
		host = "models"
	}
	return ModelsService{
		host: host,
	}
}

func (m ModelsService) Execute(ctx context.Context, gql string, params map[string]interface{}) interface{} {
	return nil
}
