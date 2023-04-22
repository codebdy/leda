package main

import (
	"net/http"

	"codebdy.com/leda/services/logic/schema"
	"codebdy.com/leda/services/logic/global"
	"github.com/graphql-go/handler"
)

func main() {

	//加载ServiceSchema
	schema.Load()

	h := handler.New(&handler.Config{
		Schema:   global.ServiceSchema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/graphql", h)
	http.ListenAndServe(":4002", nil)
}
