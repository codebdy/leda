package main

import (
	"fmt"
	"log"
	"net/http"

	"codebdy.com/leda/services/schedule/middleware"
	"codebdy.com/leda/services/schedule/resolver"
	"codebdy.com/leda/services/schedule/schema"
	"github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
)

const port = ":8080"

func main() {
	schema := graphql.MustParseSchema(schema.SDL, &resolver.Resolver{})
	http.Handle("/", http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(page)
	}))

	h := &relay.Handler{Schema: schema}
	http.Handle("/graphql",
		middleware.CorsMiddleware(
			middleware.AuthMiddleware(h),
		),
	)

	fmt.Println(fmt.Sprintf("🚀 Graphql server ready at http://localhost%s/graphql", port))
	log.Fatal(http.ListenAndServe(port, nil))
}

var page = []byte(`
<!DOCTYPE html>
<html lang="en">
  <head>
    <title>GraphiQL</title>
    <style>
      body {
        height: 100%;
        margin: 0;
        width: 100%;
        overflow: hidden;
      }
      #graphiql {
        height: 100vh;
      }
    </style>
    <script src="https://unpkg.com/react@17/umd/react.development.js" integrity="sha512-Vf2xGDzpqUOEIKO+X2rgTLWPY+65++WPwCHkX2nFMu9IcstumPsf/uKKRd5prX3wOu8Q0GBylRpsDB26R6ExOg==" crossorigin="anonymous"></script>
    <script src="https://unpkg.com/react-dom@17/umd/react-dom.development.js" integrity="sha512-Wr9OKCTtq1anK0hq5bY3X/AvDI5EflDSAh0mE9gma+4hl+kXdTJPKZ3TwLMBcrgUeoY0s3dq9JjhCQc7vddtFg==" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://unpkg.com/graphiql@2.3.0/graphiql.min.css" />
  </head>
  <body>
    <div id="graphiql">Loading...</div>
    <script src="https://unpkg.com/graphiql@2.3.0/graphiql.min.js" type="application/javascript"></script>
    <script>
      ReactDOM.render(
        React.createElement(GraphiQL, {
          fetcher: GraphiQL.createFetcher({url: '/graphql'}),
          defaultEditorToolsVisibility: true,
        }),
        document.getElementById('graphiql'),
      );
    </script>
  </body>
</html>
`)
