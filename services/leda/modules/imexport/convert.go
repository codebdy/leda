package imexport

import (
	"time"

	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/model/graph"
	"rxdrag.com/entify/model/meta"
)

//处理要导入的实体对象，转化关联：
// a:xx=>a:{sync:xxx}
// 删掉关联的Id，保证所有数据都是新增
func convertInstanceValue(entity *graph.Entity, object map[string]interface{}) map[string]interface{} {
	object[consts.ID] = nil
	columns := entity.Table.Columns
	for i := range columns {
		column := columns[i]
		if column.Type == meta.DATE && object[column.Name] != nil {
			//val, err := time.Parse(object[column.Name].(string))
			//应用目前没有其它时间，可以全用now
			object[column.Name] = time.Now()
		}
	}
	allAssociation := entity.Associations()
	for i := range allAssociation {
		asso := allAssociation[i]
		value := object[asso.Name()]

		if asso.IsCombination() {
			if value != nil {
				if asso.IsArray() {
					object[asso.Name()] = map[string]interface{}{
						consts.ARG_SYNC: convertInstanceValues(asso.TypeEntity(), value.([]interface{})),
					}
				} else {
					object[asso.Name()] = map[string]interface{}{
						consts.ARG_SYNC: convertInstanceValue(asso.TypeEntity(), value.(map[string]interface{})),
					}
				}

			} else {
				object[asso.Name()] = map[string]interface{}{
					consts.ARG_CLEAR: true,
				}
			}
		}
	}

	return object
}

func convertInstanceValues(entity *graph.Entity, objects []interface{}) []interface{} {
	for _, object := range objects {
		convertInstanceValue(entity, object.(map[string]interface{}))
	}
	return objects
}
