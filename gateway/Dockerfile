FROM golang:1.18-buster as builder

ENV GOPROXY=https://goproxy.cn,direct
ENV GO111MODULE=on
ENV GOFLAGS=-mod=vendor
ENV APP_HOME /go/src/gateway

WORKDIR "$APP_HOME"
ADD . "$APP_HOME"

RUN go mod download
RUN go mod verify
RUN go get ./...
RUN go mod vendor
RUN go build -o gateway

EXPOSE 8081
CMD ["./gateway"]