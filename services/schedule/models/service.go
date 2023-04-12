package models

import "codebdy.com/leda/services/schedule/consts"

type ModelsService struct {
	host string
}

func New() ModelsService {
	return ModelsService{
		host: consts.MODEL_HOST_NAME,
	}
}

func (m ModelsService) Execute(gql string, params map[string]interface{}) interface{} {
	return nil
}
