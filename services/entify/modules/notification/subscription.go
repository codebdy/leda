package notification

import (
	"log"

	"github.com/graphql-go/graphql"
)

func (m *SubscriptionModule) SubscriptionFields() []*graphql.Field {
	if m.app != nil {
		return []*graphql.Field{
			{
				Name: "unreadNoticationCounts",
				Type: graphql.Int,
				Resolve: func(p graphql.ResolveParams) (interface{}, error) {
					return p.Source, nil
				},
				Subscribe: func(p graphql.ResolveParams) (interface{}, error) {
					subscrber := newSubscriber(m.ctx, m.app.Model)
					go func() {
						subscrber.pushCounts()
						<-p.Context.Done()
						log.Println("[RootSubscription] [Subscribe] subscription canceled")
						subscrber.destory()
					}()

					return subscrber.channel, nil
				},
			},
		}
	} else {
		return []*graphql.Field{}
	}
}
