package main

import (
	"net/http"

	"codebdy.com/leda/services/logic/schema"
	"github.com/graphql-go/handler"
)

func main() {

	//加载ServiceSchema
	schema.Init()

	h := handler.New(&handler.Config{
		Schema:   schema.ServiceSchema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/graphql", h)
	http.ListenAndServe(":4002", nil)
}
