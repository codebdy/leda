package server

import (
	"fmt"
	"net/http"
	"os"
	"sync"

	ledaconsts "github.com/codebdy/leda-service-sdk/consts"
	"github.com/nautilus/gateway"
	"github.com/nautilus/gateway/cmd/gateway/middlewares"
	"github.com/nautilus/graphql"
)

// App id 或者App name 作为key, value 是 *GatewayLoader
var gatewayCache sync.Map
var Services []string

type GatewayLoader struct {
	// app name or app id
	appKey  string
	gateWay *gateway.Gateway
	header  http.Header
}

func GetGateway(w http.ResponseWriter, r *http.Request) *gateway.Gateway {
	appKey := r.Header.Get(ledaconsts.HEADER_LEDA_APPID)
	if appKey == "" {
		appKey = r.Header.Get(ledaconsts.HEADER_LEDA_APPNAME)
	}
	if ld, ok := gatewayCache.Load(appKey); ok {
		return ld.(*GatewayLoader).gateWay
	}
	ld := newGatewayLoader(appKey, r.Header)
	gatewayCache.Store(appKey, ld)

	return ld.gateWay
}

func ClearGatway() {
	gatewayCache.Range(func(key interface{}, value interface{}) bool {
		gatewayCache.Delete(key)
		return true
	})
}

func (gl *GatewayLoader) UpdateSchemas() {
	// introspect the schemas
	schemas, err := graphql.IntrospectRemoteSchemasWithOptions(Services, graphql.IntrospectWithMiddlewares(middlewares.AppHeader(gl.header)))
	if err != nil {
		fmt.Println("Encountered error introspecting schemas:", err.Error())
		os.Exit(1)
	}

	// create the gateway instance
	gw, err := gateway.New(schemas)
	if err != nil {
		fmt.Println("Encountered error starting gateway:", err.Error())
		os.Exit(1)
	}
	gl.gateWay = gw
}

func newGatewayLoader(appKey string, header http.Header) *GatewayLoader {
	loader := GatewayLoader{
		appKey: appKey,
		header: header,
	}

	loader.UpdateSchemas()
	return &loader
}
