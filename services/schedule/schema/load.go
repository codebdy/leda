package schema

import (
	"log"

	"codebdy.com/leda/services/schedule/global"
	"codebdy.com/leda/services/schedule/resolver"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify-graphql-schema/consts"
	"github.com/codebdy/entify-graphql-schema/schema"
	ledasdk "github.com/codebdy/leda-service-sdk"
	"github.com/codebdy/leda-service-sdk/config"
	"github.com/graphql-go/graphql"
)

func Load() *graphql.Schema {
	config := config.GetDbConfig()
	//metaId已变，从数据库取，不要从文件取。安装时从文件写入数据库，id可能会变化
	//global.serviceMeta, _ = ledasdk.ReadServiceFromJson(install.MODEL_SEED)
	serviceMeta, err := ledasdk.GetServiceMata(global.SERVICE_NAME, config)
	if err != nil {
		panic(err.Error())
	}

	global.ServiceMeta = serviceMeta

	repo := entify.New(config)
	repo.Init(serviceMeta.Content, serviceMeta.Id)
	metaSchema := schema.New(repo)
	//加载自定义API
	metaSchema.ParseApi(&resolver.Resolver{})
	rootQuery := graphql.NewObject(graphql.ObjectConfig{
		//首字母要大写，要不然网关合并不了，这个问题解决了2天
		Name:   consts.ROOT_QUERY_NAME,
		Fields: metaSchema.QueryFields,
	})

	rootMutation := graphql.NewObject(graphql.ObjectConfig{
		Name:   consts.ROOT_MUTATION_NAME,
		Fields: metaSchema.MutationFields,
	})
	schemaConfig := graphql.SchemaConfig{
		Query:      rootQuery,
		Mutation:   rootMutation,
		Directives: metaSchema.Directives,
		Types:      metaSchema.Types,
	}

	schema, err := graphql.NewSchema(schemaConfig)

	if err != nil {
		log.Panic(err.Error())
	}

	return &schema
}
