package notification

import (
	"context"
	"log"
	"sync"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/observer"
	"rxdrag.com/entify/modules/app"
	"rxdrag.com/entify/modules/register"
)

const EntityNotificationName = "Notification"

var NoticeModelObserver *NotificationObserver

type NotificationObserver struct {
	key         string
	subscribers sync.Map
}

func init() {
	//创建模型监听器
	NoticeModelObserver = &NotificationObserver{
		key: "NotificationObserver",
	}
	observer.AddObserver(NoticeModelObserver)
}

func (o *NotificationObserver) Key() string {
	return o.key
}

func (o *NotificationObserver) ObjectPosted(object map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	if entity.Name() == EntityNotificationName {
		o.distributeChanged(object, ctx)
	}
}
func (o *NotificationObserver) ObjectMultiPosted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	if entity.Name() == EntityNotificationName {
		for _, object := range objects {
			o.distributeChanged(object, ctx)
		}
	}
}
func (o *NotificationObserver) ObjectDeleted(object map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	if entity.Name() == EntityNotificationName {
		o.distributeDeleted(ctx)
	}
}

func (o *NotificationObserver) ObjectMultiDeleted(objects []map[string]interface{}, entity *graph.Entity, ctx context.Context) {
	if entity.Name() == EntityNotificationName {
		o.distributeDeleted(ctx)
	}
}

func (o *NotificationObserver) isEmperty() bool {
	emperty := true
	o.subscribers.Range(func(key interface{}, value interface{}) bool {
		emperty = false
		return true
	})
	return emperty
}

//分发详细信息到各订阅者
func (o *NotificationObserver) distributeChanged(object map[string]interface{}, ctx context.Context) {
	if o.isEmperty() {
		return
	}
	model := app.GetSystemApp().Model
	entity := model.Graph.GetEntityByName(EntityNotificationName)
	if entity == nil {
		log.Panic("Can find entity Notification")
	}

	//补全信息
	gql := `
		query($id:ID!){
			oneNotification(where:{
				id:{
					_eq:$id
				}
			}){
				id
				app{
					id
				}
				user{
					id
				}
			}
		}
	`

	params := graphql.Params{
		Schema:        register.GetSchema(ctx),
		RequestString: gql,
		VariableValues: map[string]interface{}{
			consts.ID: object[consts.ID],
		},
		Context: context.WithValue(ctx, "gql", gql),
	}

	r := graphql.Do(params)
	if len(r.Errors) > 0 {
		log.Printf("failed to execute graphql operation, errors: %+v", r.Errors)
		log.Panic(r.Errors[0].Error())
	}

	if r.Data != nil {
		//分发
		o.subscribers.Range(func(key interface{}, value interface{}) bool {
			notification := r.Data.(map[string]interface{})["oneNotification"]
			if notification != nil {
				value.(*Subscriber).notificationChanged(notification.(map[string]interface{}), ctx)
			} else {
				log.Panicln("Can not query notification")
			}

			return true
		})

	}
}

func (o *NotificationObserver) distributeDeleted(ctx context.Context) {
	o.subscribers.Range(func(key interface{}, value interface{}) bool {
		value.(*Subscriber).notificationDeleted(ctx)
		return true
	})
}

func (o *NotificationObserver) addSubscriber(s *Subscriber) {
	o.subscribers.Store(s.key, s)
}

func (o *NotificationObserver) deleteSubscriber(key string) {
	o.subscribers.Delete(key)
}
