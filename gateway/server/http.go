package server

import (
	"context"
	"fmt"
	"net/http"
	"os"
	"strings"

	"github.com/nautilus/gateway"
)

const ALL_HEADERS = "ALL_HEADERS"

func ListenAndServe(port string) {

	// add the graphql endpoints to the router
	http.HandleFunc("/graphql", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodGet && strings.Contains(r.Header.Get("Accept"), "text/html") { // rudimentary check to see if this is accessed from a browser UI
			// if calling from a UI, redirect to the UI handler
			http.Redirect(w, r, "/", http.StatusTemporaryRedirect)
			return
		}
		setCors(w, r)
		if r.Method == http.MethodOptions {
			return
		}
		//把所有header 放入context 转发到请求
		r = r.WithContext(context.WithValue(r.Context(), ALL_HEADERS, r.Header))
		gw := GetGateway(w, r)
		gw.GraphQLHandler(w, r)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		setCors(w, r)
		gw := GetGateway(w, r)
		playgroundHandler := gw.StaticPlaygroundHandler(gateway.PlaygroundConfig{
			Endpoint: "/graphql",
		})
		if r.URL.Path != "/" {
			// ensure our catch-all handler pattern "/" only runs on "/"
			http.NotFound(w, r)
			return
		}

		// if we are handling a pre-flight request
		if r.Method == http.MethodOptions {
			return
		}

		playgroundHandler.ServeHTTP(w, r)
	})

	// start the server
	fmt.Printf("🚀 Gateway is ready at http://localhost:%s/graphql\n", port)
	err := http.ListenAndServe(fmt.Sprintf(":%s", port), nil)
	if err != nil {
		fmt.Println(err.Error())
		os.Exit(1)
	}
}

func setCors(w http.ResponseWriter, r *http.Request) {
	// set the necessary CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Credentials", "true")
	w.Header().Set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT")
	w.Header().Set("Access-Control-Allow-Headers", "*")
}
