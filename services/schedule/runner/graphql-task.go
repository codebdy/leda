package runner

import (
	"context"
	"log"

	"codebdy.com/leda/services/schedule/entities"
	"github.com/machinebox/graphql"
)

func excuteGraphqlTask(taskConfig entities.TaskConfig) {
	// create a client (safe to share across requests)
	client := graphql.NewClient(taskConfig.Url)

	// make a request
	req := graphql.NewRequest(`
    query ($key: String!) {
        items (id:$key) {
            field1
            field2
            field3
        }
    }
`)

	// set any variables
	req.Var("key", "value")

	// set header fields
	req.Header.Set("Cache-Control", "no-cache")

	// define a Context for the request
	ctx := context.Background()

	// run it and capture the response
	var graphqlResponse interface{}
	if err := client.Run(ctx, req, &graphqlResponse); err != nil {
		log.Fatal(err)
	}
}
