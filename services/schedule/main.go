package main

import (
	"fmt"
	"net/http"

	_ "codebdy.com/leda/services/schedule/install"
	"codebdy.com/leda/services/schedule/runner"
	_ "codebdy.com/leda/services/schedule/runner"
	"codebdy.com/leda/services/schedule/schema"
	"github.com/graphql-go/handler"
)

const port = ":4002"

func main() {
	schema := schema.Load()

	runner.Run()
	h := handler.New(&handler.Config{
		Schema:     schema,
		Pretty:     true,
		Playground: true,
	})

	http.Handle("/graphql", h)
	fmt.Println(fmt.Sprintf("🚀 Graphql server ready at http://localhost%s/graphql", port))
	http.ListenAndServe(port, nil)
}
