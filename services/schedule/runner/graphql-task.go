package runner

import (
	"context"
	"log"

	"codebdy.com/leda/services/schedule/entities"
	"github.com/codebdy/entify/shared"
	"github.com/machinebox/graphql"
)

func excuteGraphqlTask(taskConfig entities.TaskConfig) {
	defer shared.PrintErrorStack()
	// create a client (safe to share across requests)
	client := graphql.NewClient(taskConfig.Url)

	// make a request
	req := graphql.NewRequest(taskConfig.Gql)

	if taskConfig.Params != nil {
		paramMap := taskConfig.Params.(map[string]interface{})
		for key, value := range paramMap {
			// set any variables
			req.Var(key, value)
		}
	}

	// set header fields
	req.Header.Set("Cache-Control", "no-cache")

	if taskConfig.Headers != nil {
		headersMap := taskConfig.Headers.(map[string]interface{})
		for key, value := range headersMap {
			req.Header.Set(key, value.(string))
		}
	}

	// define a Context for the request
	ctx := context.Background()

	// run it and capture the response
	var graphqlResponse interface{}
	if err := client.Run(ctx, req, &graphqlResponse); err != nil {
		log.Fatal(err)
	}
}
