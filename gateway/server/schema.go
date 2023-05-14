package server

import (
	"sync"

	"github.com/nautilus/gateway"
)

// App id 或者App name 作为key, value 是 *GatewayLoader
var gatewayCache sync.Map
var Services []string

type GatewayLoader struct {
	// app name or app id
	appKey  string
	gateWay *gateway.Gateway
}

func GetGateWay(appKey string) *gateway.Gateway {
	if ld, ok := gatewayCache.Load(appKey); ok {
		return ld.(*GatewayLoader).gateWay
	}
	ld := newGatewayLoader(appKey)
	gatewayCache.Store(appKey, ld)

	return ld.gateWay
}

func (gl *GatewayLoader) UpdateSchemas() {

}

func newGatewayLoader(appKey string) *GatewayLoader {
	loader := GatewayLoader{
		appKey: appKey,
	}

	loader.UpdateSchemas()
	return &loader
}
