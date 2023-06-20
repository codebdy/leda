package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	_ "codebdy.com/leda/services/schedule/install"
	"codebdy.com/leda/services/schedule/runner"
	_ "codebdy.com/leda/services/schedule/runner"
	"codebdy.com/leda/services/schedule/schema"
	"github.com/graphql-go/handler"
)

const port = ":4002"

func init() {
	log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	logFile, err := os.OpenFile("./debug.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	if err != nil {
		log.Panic("打开日志文件异常")
	}
	log.SetOutput(logFile)
}

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
