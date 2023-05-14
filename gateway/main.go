package main

import (
	"github.com/nautilus/gateway/cmd/gateway/server"
	"github.com/spf13/cobra"
)

var rootCmd = &cobra.Command{
	Use:   "graphql-gateway",
	Short: "GraphQL Gateway is a standalone service to consolidate your GraphQL APIs.",
}

// start the gateway executable
func main() {
	server.Services = []string{
		"http://localhost:4000/graphql",
		"http://localhost:4002/graphql",
	}
	server.ListenAndServe([]string{
		"http://localhost:4000/graphql",
		"http://localhost:4002/graphql",
	},
		"8081",
	)
}
