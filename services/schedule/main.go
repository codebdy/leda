package main

import (
	"fmt"
	"log"
	"net/http"

	"codebdy.com/leda/services/schedule/middleware"
	"codebdy.com/leda/services/schedule/schema"
	"github.com/graphql-go/handler"
)

const PORT = "8080"

func main() {

	schema, err := schema.CreateSchema()
	if err != nil {
		log.Fatalf("failed to create new schema, error: %v", err)
	}

	h := handler.New(&handler.Config{
		Schema:   &schema,
		Pretty:   true,
		GraphiQL: true,
	})

	http.Handle("/graphql",
		middleware.CorsMiddleware(
			middleware.AuthMiddleware(h),
		),
	)
	fmt.Println(fmt.Sprintf("Running a GraphQL API server at http://localhost:%s/graphql", PORT))
	err2 := http.ListenAndServe(":"+PORT, nil)
	if err2 != nil {
		fmt.Printf("Start failure:%s", err2)
	}
}
