package notification

import (
	"context"
	"fmt"
	"log"

	"github.com/google/uuid"
	"rxdrag.com/entify/common/contexts"
	"rxdrag.com/entify/model"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/orm"
)

type Subscriber struct {
	key     string
	channel chan (interface{})
	ctx     context.Context
	model   *model.Model
}

func newSubscriber(ctx context.Context, model *model.Model) *Subscriber {
	s := &Subscriber{
		key:     uuid.New().String(),
		channel: make(chan interface{}),
		ctx:     ctx,
		model:   model,
	}
	NoticeModelObserver.addSubscriber(s)
	return s
}

func (s *Subscriber) notificationChanged(notification map[string]interface{}, ctx context.Context) {
	me := contexts.Values(s.ctx).Me
	appId := contexts.Values(s.ctx).AppId

	if me == nil || appId == 0 {
		log.Panic("User or app not set!")
	}

	if notification["user"] == nil {
		log.Panic("Notification no user")
	}

	if notification["app"] == nil {
		log.Panic("Notification no app")
	}

	if notification["user"].(map[string]interface{})["id"] == me.Id && notification["app"].(map[string]interface{})["id"] == fmt.Sprintf("%d", appId) {
		s.pushCounts()
	}
}

func (s *Subscriber) pushCounts() {
	me := contexts.Values(s.ctx).Me
	appId := contexts.Values(s.ctx).AppId

	session, err := orm.Open()
	if err != nil {
		log.Panic(err.Error())
	}

	result := session.Query(
		s.model.Graph.GetEntityByName(EntityNotificationName),
		map[string]interface{}{
			"where": map[string]interface{}{
				"_and": []map[string]interface{}{
					{
						"user": map[string]interface{}{
							"id": map[string]interface{}{
								"_eq": me.Id,
							},
						},
					},
					{
						"app": map[string]interface{}{
							"id": map[string]interface{}{
								"_eq": appId,
							},
						},
					},
				},
			},
		},
		[]*graph.Attribute{},
	)
	s.channel <- result.Total
}

func (s *Subscriber) notificationDeleted(ctx context.Context) {
	me := contexts.Values(ctx).Me
	appId := contexts.Values(ctx).AppId

	if me == nil || appId == 0 {
		log.Panic("User or app not set!")
	}

	localMe := contexts.Values(s.ctx).Me
	loacalAppId := contexts.Values(s.ctx).AppId

	if localMe == nil || loacalAppId == 0 {
		log.Panic("Local User or app not set!")
	}

	if me.Id == localMe.Id && appId == loacalAppId {
		s.pushCounts()
	}
}

func (s *Subscriber) destory() {
	close(s.channel)
	NoticeModelObserver.deleteSubscriber(s.key)
}
