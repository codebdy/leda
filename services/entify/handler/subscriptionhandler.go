package handler

import (
	"context"
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/modules/register"
)

type SubscriptionHandler struct {
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
	Subprotocols: []string{"graphql-ws"}, //  subscriptions-transport-ws 使用 graphql-ws，其它的使用"graphql-transport-ws" 这个还不会用,
}

type ConnectionACKMessage struct {
	OperationID string `json:"id,omitempty"`
	Type        string `json:"type"`
	Payload     struct {
		Query string `json:"query"`
	} `json:"payload,omitempty"`
}

func NewSubscription() *SubscriptionHandler {
	return &SubscriptionHandler{}
}

// ServeHTTP provides an entrypoint into executing graphQL queries.
func (h *SubscriptionHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	h.ContextHandler(r.Context(), w, r)
}

func (h *SubscriptionHandler) ContextHandler(ctx context.Context, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Printf("failed to do websocket upgrade: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	connectionACK, err := json.Marshal(map[string]string{
		"type": "connection_ack",
	})
	if err != nil {
		log.Printf("failed to marshal ws connection ack: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}

	if err := conn.WriteMessage(websocket.TextMessage, connectionACK); err != nil {
		log.Printf("failed to write to ws connection: %v", err)
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
	schema := register.GetSchema(ctx)
	go handleSubscription(conn, &schema)
}

func handleSubscription(conn *websocket.Conn, schema *graphql.Schema) {
	var subscriber *Subscriber
	subscriptionCtx, subscriptionCancelFn := context.WithCancel(context.Background())

	handleClosedConnection := func() {
		log.Println("[SubscriptionsHandler] subscriber closed connection")
		unsubscribe(subscriptionCancelFn, subscriber)
		return
	}

	for {
		_, p, err := conn.ReadMessage()
		if err != nil {
			log.Printf("failed to read websocket message: %v", err)
			subscriptionCancelFn()
			return
		}

		var msg ConnectionACKMessage
		if err := json.Unmarshal(p, &msg); err != nil {
			log.Printf("failed to unmarshal websocket message: %v", err)
			continue
		}

		if msg.Type == "stop" {
			handleClosedConnection()
			return
		}

		if msg.Type == "start" {
			subscriber = subscribe(subscriptionCtx, subscriptionCancelFn, conn, msg, schema)
		}
	}
}

type Subscriber struct {
	UUID          string
	Conn          *websocket.Conn
	RequestString string
	OperationID   string
}

var subscribers sync.Map

func subscribersSize() uint64 {
	var size uint64
	subscribers.Range(func(_, _ interface{}) bool {
		size++
		return true
	})
	return size
}

func unsubscribe(subscriptionCancelFn context.CancelFunc, subscriber *Subscriber) {
	subscriptionCancelFn()
	if subscriber != nil {
		subscriber.Conn.Close()
		subscribers.Delete(subscriber.UUID)
	}
	log.Printf("[SubscriptionsHandler] subscribers size: %+v", subscribersSize())
}

func subscribe(ctx context.Context,
	subscriptionCancelFn context.CancelFunc,
	conn *websocket.Conn, msg ConnectionACKMessage,
	schema *graphql.Schema,
) *Subscriber {
	subscriber := &Subscriber{
		UUID:          uuid.New().String(),
		Conn:          conn,
		RequestString: msg.Payload.Query,
		OperationID:   msg.OperationID,
	}
	subscribers.Store(subscriber.UUID, &subscriber)

	log.Printf("[SubscriptionsHandler] subscribers size: %+v", subscribersSize())

	sendMessage := func(r *graphql.Result) error {
		message, err := json.Marshal(map[string]interface{}{
			"type":    "data",
			"id":      subscriber.OperationID,
			"payload": r.Data,
		})
		if err != nil {
			return err
		}

		if err := subscriber.Conn.WriteMessage(websocket.TextMessage, message); err != nil {
			return err
		}

		return nil
	}

	go func() {
		subscribeParams := graphql.Params{
			Context:       ctx,
			RequestString: msg.Payload.Query,
			Schema:        *schema,
		}

		subscribeChannel := graphql.Subscribe(subscribeParams)

		for {
			select {
			case <-ctx.Done():
				log.Printf("[SubscriptionsHandler] subscription ctx done")
				return
			case r, isOpen := <-subscribeChannel:
				if !isOpen {
					log.Printf("[SubscriptionsHandler] subscription channel closed")
					unsubscribe(subscriptionCancelFn, subscriber)
					return
				}
				if err := sendMessage(r); err != nil {
					if err == websocket.ErrCloseSent {
						unsubscribe(subscriptionCancelFn, subscriber)
					}
					log.Printf("failed to send message: %v", err)
				}
			}
		}
	}()

	return subscriber
}
