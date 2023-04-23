package main

import (
	"fmt"
	"net/http"

	"codebdy.com/leda/services/logic/global"
	"codebdy.com/leda/services/logic/schema"
	"github.com/graphql-go/handler"
)

const port = ":4002"

func main() {

	//加载ServiceSchema
	schema.Load()

	h := handler.New(&handler.Config{
		Schema:   global.ServiceSchema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/graphql", h)
	fmt.Println(fmt.Sprintf("🚀 Graphql server ready at http://localhost%s/graphql", port))
	http.ListenAndServe(port, nil)
}
