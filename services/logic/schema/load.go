package schema

import (
	"codebdy.com/leda/services/logic/consts"
	"github.com/codebdy/entify"
	ledasdk "github.com/codebdy/leda-service-sdk"
	"github.com/codebdy/leda-service-sdk/config"
)

func Load() {
	config := config.GetDbConfig()

	umlMeta, err := ledasdk.GetMata(consts.SERVICE_NAME, config)

	repo := entify.New(config)
	repo.Init(*umlMeta, metaId)
	schema := schema.New(repo)
	if err != nil {
		panic(err.Error())
	}

}
