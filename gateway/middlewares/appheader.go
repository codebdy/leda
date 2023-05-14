package middlewares

import (
	"net/http"

	ledaconsts "github.com/codebdy/leda-service-sdk/consts"
	"github.com/nautilus/graphql"
)

func AppHeader(header http.Header) graphql.NetworkMiddleware {
	return func(r *http.Request) error {
		r.Header.Set(ledaconsts.HEADER_LEDA_APPNAME, header.Get(ledaconsts.HEADER_LEDA_APPNAME))
		r.Header.Set(ledaconsts.HEADER_LEDA_APPID, header.Get(ledaconsts.HEADER_LEDA_APPID))
		return nil
	}
}
