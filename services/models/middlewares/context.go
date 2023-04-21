package middlewares

import (
	"context"
	"net/http"
	"strconv"
	"strings"
	"time"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/contexts"
	"github.com/thinkeridea/go-extend/exnet"
)

// 传递公共参数中间件
func ContextMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		//为了测试loading状态，生产版需要删掉
		time.Sleep(time.Duration(300) * time.Millisecond)

		ctx := TransContext(w, r)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func TransContext(w http.ResponseWriter, r *http.Request) context.Context {
	reqToken := r.Header.Get(consts.AUTHORIZATION)
	splitToken := strings.Split(reqToken, consts.BEARER)
	v := contexts.ContextValues{}
	if len(splitToken) == 2 {
		reqToken = splitToken[1]
		if reqToken != "" {
			v.Token = reqToken
			// me, err := authentication.GetUserByToken(reqToken)
			// if err != nil {
			// 	http.Error(w, err.Error(), http.StatusInternalServerError)
			// 	return r.Context()
			// }
			// v.Me = me
		}
	}
	appId := r.Header.Get(consts.HEADER_LEDA_APPID)
	if appId != "" {
		intAppId, _ := strconv.ParseUint(appId, 10, 64)
		v.AppId = intAppId
	}

	appName := r.Header.Get(consts.HEADER_LEDA_APPNAME)
	v.AppName = appName

	v.Host = r.Host
	ip := exnet.ClientPublicIP(r)
	if ip == "" {
		ip = exnet.ClientIP(r)
	}
	v.IP = ip
	ctx := context.WithValue(r.Context(), consts.CONTEXT_VALUES, v)

	return ctx
}
