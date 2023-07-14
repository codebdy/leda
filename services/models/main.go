package main

import (
	"fmt"
	"log"
	"net/http"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/errorx"
	"codebdy.com/leda/services/models/handler"
	"codebdy.com/leda/services/models/middlewares"
	"codebdy.com/leda/services/models/modules/app"
	"codebdy.com/leda/services/models/modules/register"
	"github.com/codebdy/entify"
	"github.com/codebdy/entify/db"
	"github.com/codebdy/leda-service-sdk/config"

	_ "codebdy.com/leda/services/models/install"
	_ "codebdy.com/leda/services/models/modules/app"
	_ "codebdy.com/leda/services/models/modules/publish"
	_ "codebdy.com/leda/services/models/modules/snapshot"
	_ "github.com/go-sql-driver/mysql"
)

const PORT = 4000

func init() {
	// log.SetFlags(log.Ldate | log.Ltime | log.Lshortfile)
	// logFile, err := os.OpenFile("./debug.log", os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0644)
	// if err != nil {
	// 	log.Panic("打开日志文件异常")
	// }
	// log.SetOutput(logFile)
}

func checkParams() {
	dbConfig := config.GetDbConfig()
	if dbConfig.Driver == "" ||
		dbConfig.Host == "" ||
		dbConfig.Database == "" ||
		dbConfig.User == "" ||
		dbConfig.Port == "" ||
		dbConfig.Password == "" {
		panic("Params is not enough, please set")
	}
}

func checkMetaInstall() {
	repo := entify.New(config.GetDbConfig())
	if !repo.IsEntityExists(consts.META_ENTITY_NAME) {
		app.Installed = false
	} else {
		app.Installed = true
	}
}

func main() {
	defer db.Close()
	log.Println("启动应用")
	checkMetaInstall()
	checkParams()

	h := handler.New(&handler.Config{
		Pretty:         true,
		GraphiQLConfig: &handler.GraphiQLConfig{},
		FormatErrorFn:  errorx.Format,
	})

	http.Handle("/graphql",
		middlewares.CorsMiddleware(
			middlewares.ContextMiddleware(
				register.AppendMiddlewares(h),
			),
		),
	)
	fmt.Println(fmt.Sprintf("🚀 Graphql server ready at http://localhost:%d/graphql", PORT))

	err := http.ListenAndServe(fmt.Sprintf(":%d", PORT), nil)
	if err != nil {
		fmt.Printf("启动失败:%s", err)
		log.Panic(err.Error())
	}
}
