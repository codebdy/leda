module github.com/nautilus/gateway/cmd/gateway

go 1.16

require (
	github.com/codebdy/leda-service-sdk v0.0.4
	github.com/nautilus/gateway v0.3.9
	github.com/nautilus/graphql v0.0.20
	github.com/sirupsen/logrus v1.9.0 // indirect
	github.com/spf13/cobra v0.0.5
)

//replace github.com/codebdy/leda-service-sdk v0.0.3 => ../../leda-service-sdk
