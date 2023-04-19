package logs

import (
	"context"

	"codebdy.com/leda/services/models/model/graph"
)

func WriteModelLog(
	cls *graph.Class,
	ctx context.Context,
	operate string,
	result string,
	gql interface{},
) {
	// model := model.SystemModel.Graph
	// contextsValues := contexts.Values(ctx)
	// logObject := map[string]interface{}{
	// 	"ip":          contextsValues.IP,
	// 	"operateType": operate,
	// 	"classUuid":   cls.Uuid(),
	// 	"className":   cls.Name(),
	// 	"gql":         gql,
	// 	"result":      result,
	// }
	// if contextsValues.Me != nil {
	// 	logObject["user"] = map[string]interface{}{
	// 		"add": map[string]interface{}{
	// 			"id": contextsValues.Me.Id,
	// 		},
	// 	}
	// }

	// if contextsValues.AppId != 0 {
	// 	logObject["app"] = map[string]interface{}{
	// 		"add": map[string]interface{}{
	// 			"id": contextsValues.AppId,
	// 		},
	// 	}
	// }

	// instance := data.NewInstance(logObject, model.GetEntityByName("ModelLog"))
	// s := service.NewSystem()
	// s.SaveOne(instance)
}

func WriteBusinessLog(
	ctx context.Context,
	operate string,
	result string,
	message string,
) {
	//contextsValues := contexts.Values(ctx)

	//useId := ""
	// if contextsValues.Me != nil {
	// 	useId = contextsValues.Me.Id
	// }

	//WriteUserBusinessLog(useId, ctx, operate, result, message)
}

func WriteUserBusinessLog(
	useId string,
	ctx context.Context,
	operate string,
	result string,
	message string,
) {
	// model := model.SystemModel.Graph
	// contextsValues := contexts.Values(ctx)

	// logObject := map[string]interface{}{
	// 	"ip":          contextsValues.IP,
	// 	"appUuid":     contextsValues.AppId,
	// 	"operateType": operate,
	// 	"result":      result,
	// 	"message":     message,
	// }
	// if useId != "" {
	// 	logObject["user"] = map[string]interface{}{
	// 		"add": map[string]interface{}{
	// 			"id": useId,
	// 		},
	// 	}
	// }

	// if contextsValues.AppId != 0 {
	// 	logObject["app"] = map[string]interface{}{
	// 		"add": map[string]interface{}{
	// 			"id": contextsValues.AppId,
	// 		},
	// 	}
	// }

	// instance := data.NewInstance(logObject, model.GetEntityByName("BusinessLog"))
	// s := service.NewSystem()
	// s.SaveOne(instance)
}
