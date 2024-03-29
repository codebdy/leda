package snapshot

import (
	"context"
	"fmt"
	"log"
	"strings"
	"time"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/modules/app"
	"codebdy.com/leda/services/models/modules/register"
	"github.com/codebdy/entify-core/model/graph"
	"github.com/codebdy/entify-core/shared"
	"github.com/codebdy/entify-graphql-schema/service"
	"github.com/graphql-go/graphql"
)

const (
	APP_ID      = "appId"
	INSTANCE_ID = "instanceId"
	VERSION     = "version"
	DESCRIPTION = "description"
)

func (m *SnapshotModule) MutationFields() []*graphql.Field {
	if !app.Installed || m.app == nil || m.app.AppId == 0 {
		return []*graphql.Field{}
	}
	return []*graphql.Field{
		{
			Name: "makeVersion",
			Type: graphql.Boolean,
			Args: graphql.FieldConfigArgument{
				APP_ID: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: graphql.ID,
					},
				},
				INSTANCE_ID: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: graphql.ID,
					},
				},
				VERSION: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{
						OfType: graphql.String,
					},
				},
				DESCRIPTION: &graphql.ArgumentConfig{
					Type: graphql.String,
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer shared.PrintErrorStack()
				return m.makeVersion(p)
			},
		},
	}
}

func (m *SnapshotModule) makeVersion(p graphql.ResolveParams) (interface{}, error) {
	appId := shared.Uint64Value(p.Args[APP_ID])
	if appId == 0 {
		log.Panic("App id is nil")
	}
	instanceId := shared.Uint64Value(p.Args[INSTANCE_ID])

	if instanceId == 0 {
		log.Panic("Instance id is nil")
	}

	entityInnerId := shared.DecodeEntityInnerId(instanceId)

	entity := m.app.GetEntityByInnerId(entityInnerId)

	if entity == nil {
		log.Panic(fmt.Sprintf("Can not find entity by inner id:%d", entityInnerId))
	}

	operateName := fmt.Sprintf("one%s", entity.Name())

	//防止循环组合带来的死循环
	entityUuids := []string{}

	queryGql := fmt.Sprintf(`
	query ($id:ID!){
		%s(where:{
			id:{
				_eq:$id
			}
		})
		%s
	}
	`,
		operateName,
		m.makeFieldsGql(entity, &entityUuids),
	)

	gqlSchema := register.GetSchema(p.Context)
	params := graphql.Params{
		Schema:         gqlSchema,
		RequestString:  queryGql,
		VariableValues: map[string]interface{}{"id": instanceId},
		//OperationName:  opts.OperationName,
		Context: context.WithValue(p.Context, "gql", queryGql),
	}

	result := graphql.Do(params)
	if len(result.Errors) > 0 {
		log.Panic(result.Errors[0])
	}
	if result.Data != nil {
		s := service.New(p.Context, m.app.Repo)
		_, err := s.SaveOne("Snapshot", map[string]interface{}{
			"app": map[string]interface{}{
				"sync": map[string]interface{}{
					"id": appId,
				},
			},
			"instanceId":        instanceId,
			consts.META_CONTENT: result.Data.(map[string]interface{})[operateName],
			"version":           p.Args["version"],
			"description":       p.Args["description"],
			"createdAt":         time.Now(),
		})
		if err != nil {
			log.Panic(err.Error())
		}
	} else {
		log.Panic("Can not query data")
	}

	return true, nil
}

func existInarray(uuid string, arr []string) bool {
	for _, item := range arr {
		if item == uuid {
			return true
		}
	}

	return false
}

func (m *SnapshotModule) makeFieldsGql(entity *graph.Entity, entityUuids *[]string) string {
	*entityUuids = append(*entityUuids, entity.Uuid())
	fieldStrings := strings.Join(entity.AllAttributeNames(), "\n") + "\n"
	for _, assoc := range entity.Associations() {
		if assoc.IsCombination() && !existInarray(assoc.TypeEntity().Uuid(), *entityUuids) {
			subFields := m.makeFieldsGql(assoc.TypeEntity(), entityUuids)
			fieldStrings = fieldStrings + assoc.Name() + subFields
		}
	}
	return fmt.Sprintf("{\n%s\n}\n", fieldStrings)
}
