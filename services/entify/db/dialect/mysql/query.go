package mysql

import (
	"fmt"
	"log"
	"strings"

	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/model/data"
	"rxdrag.com/entify/model/graph"
)

type MySQLBuilder struct {
}

func (*MySQLBuilder) BuildFieldExp(fieldName string, fieldArgs map[string]interface{}) (string, []interface{}) {
	var params []interface{}
	queryStr := ""
	for key, value := range fieldArgs {
		switch key {
		case consts.ARG_EQ:
			queryStr = fieldName + "= ?"
			params = append(params, value)
			break
		case consts.ARG_GT:
			queryStr = fieldName + "> ?"
			params = append(params, value)
			break
		case consts.ARG_GTE:
			queryStr = fieldName + ">= ?"
			params = append(params, value)
			break
		case consts.ARG_IN:
			values := value.([]interface{})
			placeHolders := []string{}
			for i := range values {
				placeHolders = append(placeHolders, "?")
				params = append(params, values[i])
			}
			if len(placeHolders) > 0 {
				queryStr = fieldName + fmt.Sprintf(" IN(%s)", strings.Join(placeHolders, ","))
			} else {
				queryStr = " false "
			}
			break
		case consts.ARG_ISNULL:
			if value == true {
				queryStr = "ISNULL(" + fieldName + ")"
			}
			break
		case consts.ARG_LT:
			queryStr = fieldName + "< ?"
			params = append(params, value)
			break
		case consts.ARG_LTE:
			queryStr = fieldName + "<= ?"
			params = append(params, value)
			break
		case consts.ARG_NOTEQ:
			queryStr = fieldName + "<> ?"
			params = append(params, value)
			break
		case consts.ARG_NOTIN:
			values := value.([]string)
			placeHolders := []string{}
			for i := range values {
				placeHolders = append(placeHolders, "?")
				params = append(params, values[i])
			}
			if len(placeHolders) > 0 {
				queryStr = fieldName + fmt.Sprintf(" NOT IN(%s)", strings.Join(placeHolders, ","))
			} else {
				queryStr = " true "
			}
			break
		case consts.ARG_ILIKE:
			queryStr = fieldName + " LIKE ?"
			params = append(params, value)
			break
		case consts.ARG_LIKE:
			queryStr = fieldName + " LIKE BINARY ?"
			params = append(params, value)
			break
		case consts.ARG_NOTILIKE:
			queryStr = fieldName + " NOT LIKE ?"
			params = append(params, value)
			break
		case consts.ARG_NOTLIKE:
			queryStr = fieldName + " NOT LIKE BINARY ?"
			params = append(params, value)
			break
		case consts.ARG_NOTREGEX:
			queryStr = fieldName + " NOT REGEXP ?"
			params = append(params, value)
			break
		// case consts.ARG_NOTSIMILAR:
		// 	queryStr = fieldName + " SIMILAR "
		// 	params = append(params, value)
		// 	break
		case consts.ARG_REGEX:
			queryStr = fieldName + " REGEXP "
			params = append(params, value)
			break
		default:
			panic("Can not find token:" + key)
		}
	}

	return "(" + queryStr + ")", params
}

func (b *MySQLBuilder) BuildBoolExp(argEntity *graph.ArgEntity, where map[string]interface{}) (string, []interface{}) {
	var params []interface{}
	querys := []string{}
	for key, value := range where {
		switch key {
		case consts.ARG_AND:
			ands, ok := value.([]interface{})
			if !ok {
				ands2 := value.([]map[string]interface{})
				for i := range ands2 {
					ands = append(ands, ands2[i])
				}
			}
			for _, andValue := range ands {
				andStr, andParam := b.BuildBoolExp(argEntity, andValue.(map[string]interface{}))
				querys = append(querys, andStr)
				params = append(params, andParam...)
			}
			break
		case consts.ARG_NOT:
			break
		case consts.ARG_OR:
			ors, ok := value.([]interface{})
			if !ok {
				ors2 := value.([]map[string]interface{})
				for i := range ors2 {
					ors = append(ors, ors2[i])
				}
			}
			orQuerys := []string{}
			for _, orValue := range ors {
				orStr, andParam := b.BuildBoolExp(argEntity, orValue.(map[string]interface{}))
				orQuerys = append(orQuerys, orStr)
				params = append(params, andParam...)
			}
			querys = append(querys, strings.Join(orQuerys, " OR "))
			break
		default:
			asso := argEntity.Entity.GetAssociationByName(key)
			//如果不是关联
			if asso == nil {
				fieldStr, fieldParam := b.BuildFieldExp(argEntity.Alise()+"."+key, value.(map[string]interface{}))
				if fieldStr != "" {
					params = append(params, fieldParam...)
					querys = append(querys, fmt.Sprintf("(%s)", fieldStr))
				}

			} else {
				argAsso := argEntity.GetAssociation(key)
				var associStrs []string
				var associParams []interface{}

				assoStr, assoParam := b.BuildBoolExp(argAsso.TypeArgEntity, value.(map[string]interface{}))
				if assoStr != "" {
					assoStr = fmt.Sprintf("(%s)", assoStr)
					associStrs = append(associStrs, assoStr)
					associParams = append(associParams, assoParam...)
				}

				querys = append(querys, strings.Join(associStrs, " OR "))
				params = append(params, associParams...)
			}
		}
	}
	return strings.Join(querys, " AND "), params
}

func buildArgAssociation(argAssociation *graph.ArgAssociation, owner *graph.ArgEntity) string {
	var sql string

	if owner != nil {
		typeEntity := argAssociation.TypeArgEntity
		povitTableAlias := fmt.Sprintf("%s_%d_%d", graph.PREFIX_T, owner.Id, typeEntity.Id)
		sql = sql + fmt.Sprintf(
			" LEFT JOIN %s %s ON %s=%s LEFT JOIN %s %s ON %s=%s ",
			argAssociation.Association.Relation.Table.Name,
			povitTableAlias,
			owner.Alise()+"."+consts.ID,
			povitTableAlias+"."+owner.Entity.Table.Name,
			typeEntity.Entity.TableName(),
			typeEntity.Alise(),
			povitTableAlias+"."+typeEntity.Entity.Table.Name,
			typeEntity.Alise()+"."+consts.ID,
		)

		for i := range typeEntity.Associations {
			sql = sql + buildArgAssociation(typeEntity.Associations[i], typeEntity)
		}
	}
	return sql
}

func (b *MySQLBuilder) BuildQueryCountSQLBody(argEntity *graph.ArgEntity) string {
	queryStr := fmt.Sprintf("select count(%s.id) from %s %s", argEntity.Alise(), argEntity.Entity.TableName(), argEntity.Alise())
	for i := range argEntity.Associations {
		association := argEntity.Associations[i]
		queryStr = queryStr + " " + buildArgAssociation(association, argEntity)
	}

	return queryStr
}

func (b *MySQLBuilder) BuildQuerySQLBody(argEntity *graph.ArgEntity, fields []*graph.Attribute) string {
	names := make([]string, len(fields))
	for i := range fields {
		names[i] = argEntity.Alise() + "." + fields[i].Name
	}
	queryStr := "select %s from %s %s "
	queryStr = fmt.Sprintf(queryStr, strings.Join(names, ","), argEntity.Entity.TableName(), argEntity.Alise())

	for i := range argEntity.Associations {
		association := argEntity.Associations[i]
		queryStr = queryStr + " " + buildArgAssociation(association, argEntity)
	}
	return queryStr
}

func (b *MySQLBuilder) BuildWhereSQL(
	argEntity *graph.ArgEntity,
	fields []*graph.Attribute,
	where map[string]interface{},
) (string, []interface{}) {
	whereStr := ""
	var params []interface{}
	if where != nil {
		boolStr, whereParams := b.BuildBoolExp(argEntity, where)
		if boolStr != "" {
			whereStr = boolStr
			params = append(params, whereParams...)
		}
	}
	return whereStr, params
}

func (b *MySQLBuilder) BuildOrderBySQL(
	argEntity *graph.ArgEntity,
	orderBy interface{},
) string {
	if orderByArgArray, ok := orderBy.([]interface{}); ok {
		argStrings := []string{}
		for i := range orderByArgArray {
			orderByArg := orderByArgArray[i].(graph.QueryArg)
			for key := range orderByArg {
				argStrings = append(argStrings, argEntity.Alise()+"."+key+" "+orderByArg[key].(string))
			}
		}
		if len(argStrings) > 0 {
			return fmt.Sprintf(" ORDER BY %s", strings.Join(argStrings, ","))
		}
	}
	return ""
	//return fmt.Sprintf(" ORDER BY %s.id DESC", argEntity.Alise())
}

func associationFieldSQL(entity *graph.Entity) string {
	names := entity.AllAttributeNames()
	for i := range names {
		names[i] = "a." + names[i]
	}
	return strings.Join(names, ",")
}

func (b *MySQLBuilder) BuildQueryByIdsSQL(entity *graph.Entity, idCounts int) string {
	parms := make([]string, idCounts)

	for i := range parms {
		parms[i] = "?"
	}
	queryStr := "select %s from %s WHERE id in(%s) "
	names := entity.AllAttributeNames()
	queryStr = fmt.Sprintf(queryStr,
		strings.Join(names, ","),
		entity.TableName(),
		strings.Join(parms, ","),
	)

	log.Println("BuildQueryByIdsSQL:", queryStr)
	return queryStr
}

func (b *MySQLBuilder) BuildQueryAssociatedInstancesSQL(
	entity *graph.Entity,
	ownerId uint64,
	povitTableName string,
	ownerFieldName string,
	typeFieldName string,
) string {
	queryStr := "select %s from %s a INNER JOIN %s b ON a.id = b.%s WHERE b.%s=%d "
	queryStr = fmt.Sprintf(queryStr,
		associationFieldSQL(entity),
		entity.TableName(),
		povitTableName,
		typeFieldName,
		ownerFieldName,
		ownerId)

	log.Println("BuildQueryAssociatedInstancesSQL:", queryStr)
	return queryStr
}

func (b *MySQLBuilder) BuildBatchAssociationBodySQL(
	argEntity *graph.ArgEntity,
	fields []*graph.Attribute,
	povitTableName string,
	ownerFieldName string,
	typeFieldName string,
	ids []uint64,
) string {
	queryStr := "select %s, povit.%s as %s from %s " +
		argEntity.Alise() +
		" INNER JOIN %s povit ON " + argEntity.Alise() +
		".id = povit.%s "
	names := make([]string, len(fields))
	parms := make([]string, len(ids))
	for i := range fields {
		names[i] = argEntity.Alise() + "." + fields[i].Name
	}

	for i := range parms {
		parms[i] = fmt.Sprintf("%d", ids[i])
	}

	queryStr = fmt.Sprintf(queryStr,
		strings.Join(names, ","),
		ownerFieldName,
		consts.ASSOCIATION_OWNER_ID,
		argEntity.Entity.TableName(),
		povitTableName,
		typeFieldName,
	)

	for i := range argEntity.Associations {
		association := argEntity.Associations[i]
		queryStr = queryStr + " " + buildArgAssociation(association, argEntity)
	}

	queryStr = queryStr + fmt.Sprintf(" WHERE povit.%s in (%s)",
		ownerFieldName,
		strings.Join(parms, ","),
	)
	return queryStr
}

// func (b *MySQLBuilder) BuildBatchAssociationSQL(
// 	tableName string,
// 	fields []*graph.Attribute,
// 	ids []uint64,
// 	povitTableName string,
// 	ownerFieldName string,
// 	typeFieldName string,
// ) string {
// 	queryStr := "select %s, povit.%s as %s from %s entity INNER JOIN %s povit ON entity.id = povit.%s WHERE povit.%s in (%s) "
// 	parms := make([]string, len(ids))
// 	names := make([]string, len(fields))
// 	for i := range parms {
// 		parms[i] = fmt.Sprintf("%d", ids[i])
// 	}
// 	for i := range fields {
// 		names[i] = "entity." + fields[i].Name
// 	}

// 	queryStr = fmt.Sprintf(queryStr,
// 		strings.Join(names, ","),
// 		ownerFieldName,
// 		consts.ASSOCIATION_OWNER_ID,
// 		tableName,
// 		povitTableName,
// 		typeFieldName,
// 		ownerFieldName,
// 		strings.Join(parms, ","),
// 	)

// 	return queryStr
// }

func (b *MySQLBuilder) BuildQueryPovitSQL(povit *data.AssociationPovit) string {
	return fmt.Sprintf(
		"SELECT * FROM `%s` WHERE (`%s` = %d AND `%s` = %d)",
		povit.Table().Name,
		povit.Source.Column.Name,
		povit.Source.Value,
		povit.Target.Column.Name,
		povit.Target.Value,
	)
}
