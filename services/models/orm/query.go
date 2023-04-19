package orm

import (
	"database/sql"
	"fmt"
	"log"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/db"
	"codebdy.com/leda/services/models/db/dialect"
	"codebdy.com/leda/services/models/model/data"
	"codebdy.com/leda/services/models/model/graph"
)

type QueryResponse struct {
	Nodes []map[string]interface{} `json:"nodes"`
	Total int                      `json:"total"`
}

// func (con *Session) buildQueryInterfaceSQL(intf *graph.Interface, args map[string]interface{}) (string, []interface{}) {
// 	var (
// 		sqls       []string
// 		paramsList []interface{}
// 	)
// 	builder := dialect.GetSQLBuilder()
// 	for i := range intf.Children {
// 		entity := intf.Children[i]
// 		whereArgs := args[consts.ARG_WHERE]
// 		argEntity := graph.BuildArgEntity(
// 			entity,
// 			whereArgs,
// 			con,
// 		)
// 		queryStr := builder.BuildQuerySQLBody(argEntity, intf.AllAttributes())
// 		if where, ok := whereArgs.(graph.QueryArg); ok {
// 			whereSQL, params := builder.BuildWhereSQL(argEntity, intf.AllAttributes(), where)
// 			if whereSQL != "" {
// 				queryStr = queryStr + " WHERE " + whereSQL
// 			}

// 			paramsList = append(paramsList, params...)
// 		}
// 		queryStr = queryStr + builder.BuildOrderBySQL(argEntity, args[consts.ARG_ORDERBY])

// 		sqls = append(sqls, queryStr)
// 	}

// 	return strings.Join(sqls, " UNION "), paramsList
// }

func (con *Session) buildQueryEntitySQL(
	entity *graph.Entity,
	args map[string]interface{},
	whereArgs interface{},
	argEntity *graph.ArgEntity,
	queryBody string,
) (string, []interface{}) {
	var paramsList []interface{}
	//whereArgs := con.v.WeaveAuthInArgs(entity.Uuid(), args[consts.ARG_WHERE])
	// argEntity := graph.BuildArgEntity(
	// 	entity,
	// 	whereArgs,
	// 	con,
	// )
	builder := dialect.GetSQLBuilder()
	queryStr := queryBody
	if where, ok := whereArgs.(graph.QueryArg); ok {
		whereSQL, params := builder.BuildWhereSQL(argEntity, entity.AllAttributes(), where)
		if whereSQL != "" {
			queryStr = queryStr + " WHERE " + whereSQL
		}
		paramsList = append(paramsList, params...)
	}

	queryStr = queryStr + builder.BuildOrderBySQL(argEntity, args[consts.ARG_ORDERBY])
	return queryStr, paramsList
}

func (con *Session) buildQueryEntityRecordsSQL(entity *graph.Entity, args map[string]interface{}, attributes []*graph.Attribute) (string, []interface{}) {
	whereArgs := args[consts.ARG_WHERE]
	argEntity := graph.BuildArgEntity(
		entity,
		whereArgs,
		con,
	)
	builder := dialect.GetSQLBuilder()
	queryStr := builder.BuildQuerySQLBody(argEntity, attributes)
	sqlStr, params := con.buildQueryEntitySQL(entity, args, whereArgs, argEntity, queryStr)

	if args[consts.ARG_LIMIT] != nil {
		sqlStr = sqlStr + fmt.Sprintf(" LIMIT %d ", args[consts.ARG_LIMIT])
	}
	if args[consts.ARG_OFFSET] != nil {
		sqlStr = sqlStr + fmt.Sprintf(" OFFSET %d ", args[consts.ARG_OFFSET])
	}

	return sqlStr, params
}

func (con *Session) buildQueryEntityCountSQL(entity *graph.Entity, args map[string]interface{}) (string, []interface{}) {
	whereArgs := args[consts.ARG_WHERE]
	argEntity := graph.BuildArgEntity(
		entity,
		whereArgs,
		con,
	)
	builder := dialect.GetSQLBuilder()
	queryStr := builder.BuildQueryCountSQLBody(argEntity)
	return con.buildQueryEntitySQL(
		entity,
		args,
		whereArgs,
		argEntity,
		queryStr,
	)
}

// func (con *Session) QueryInterface(intf *graph.Interface, args map[string]interface{}) QueryResponse {
// 	sql, params := con.buildQueryInterfaceSQL(intf, args)

// 	rows, err := con.Dbx.Query(sql, params...)
// 	defer rows.Close()
// 	if err != nil {
// 		panic(err.Error())
// 	}
// 	var instances []InsanceData
// 	for rows.Next() {
// 		values := makeInterfaceQueryValues(intf)
// 		err = rows.Scan(values...)
// 		if err != nil {
// 			panic(err.Error())
// 		}
// 		instances = append(instances, convertValuesToInterface(values, intf))
// 	}

// 	instancesIds := make([]interface{}, len(instances))
// 	for i := range instances {
// 		instancesIds[i] = instances[i][consts.ID]
// 	}

// 	for i := range intf.Children {
// 		child := intf.Children[i]
// 		oneEntityInstances := con.QueryByIds(child, instancesIds)
// 		merageInstances(instances, oneEntityInstances)
// 	}

// 	return QueryResponse{
// 		Nodes: instances,
// 		Total: 0,
// 	}
// }

func (con *Session) Query(entity *graph.Entity, args map[string]interface{}, fields []*graph.Attribute) QueryResponse {
	var instances []InsanceData

	if len(fields) > 0 {
		sqlStr, params := con.buildQueryEntityRecordsSQL(entity, args, fields)
		log.Println("doQueryEntity SQL:", sqlStr, params)
		rows, err := con.Dbx.Query(sqlStr, params...)
		defer rows.Close()
		if err != nil {
			log.Panic(err.Error(), sqlStr)
		}

		for rows.Next() {
			values := makeEntityQueryValues(fields)
			err = rows.Scan(values...)
			if err != nil {
				panic(err.Error())
			}
			instances = append(instances, convertValuesToEntity(values, fields))
		}
	}

	sqlStr, params := con.buildQueryEntityCountSQL(entity, args)
	log.Println("doQueryEntity count SQL:", sqlStr, params)
	count := 0
	err := con.Dbx.QueryRow(sqlStr, params...).Scan(&count)
	switch {
	case err == sql.ErrNoRows:
		count = 0
	case err != nil:
		log.Panic(err.Error())
	}

	return QueryResponse{
		Nodes: instances,
		Total: count,
	}
}

func (con *Session) QueryOneById(entity *graph.Entity, id interface{}) interface{} {
	return con.QueryOne(entity, graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			consts.ID: graph.QueryArg{
				consts.ARG_EQ: id,
			},
		},
	})
}

// func (con *Session) QueryOneInterface(intf *graph.Interface, args map[string]interface{}) interface{} {
// 	querySql, params := con.buildQueryInterfaceSQL(intf, args)

// 	values := makeInterfaceQueryValues(intf)
// 	err := con.Dbx.QueryRow(querySql, params...).Scan(values...)

// 	switch {
// 	case err == sql.ErrNoRows:
// 		return nil
// 	case err != nil:
// 		panic(err.Error())
// 	}

// 	instance := convertValuesToInterface(values, intf)
// 	for i := range intf.Children {
// 		child := intf.Children[i]
// 		oneEntityInstances := con.QueryByIds(child, []interface{}{instance[consts.ID]})
// 		if len(oneEntityInstances) > 0 {
// 			return oneEntityInstances[0]
// 		}
// 	}
// 	return nil
// }

func (con *Session) QueryOne(entity *graph.Entity, args map[string]interface{}) interface{} {
	queryStr, params := con.buildQueryEntityRecordsSQL(entity, args, entity.AllAttributes())

	values := makeEntityQueryValues(entity.AllAttributes())
	//log.Println("doQueryOneEntity SQL:", queryStr, params)
	err := con.Dbx.QueryRow(queryStr, params...).Scan(values...)
	switch {
	case err == sql.ErrNoRows:
		log.Println(fmt.Sprintf("Can not find instance %s, %s", entity.Name(), args))
		return nil
	case err != nil:
		log.Panic(err.Error())
	}

	instance := convertValuesToEntity(values, entity.AllAttributes())
	return instance
}

func (con *Session) QueryAssociatedInstances(r *data.AssociationRef, ownerId uint64) []InsanceData {
	var instances []InsanceData
	builder := dialect.GetSQLBuilder()
	entity := r.TypeEntity()
	queryStr := builder.BuildQueryAssociatedInstancesSQL(entity, ownerId, r.Table().Name, r.OwnerColumn().Name, r.TypeColumn().Name)
	rows, err := con.Dbx.Query(queryStr)
	defer rows.Close()
	if err != nil {
		log.Panic(err.Error())
	}

	for rows.Next() {
		values := makeEntityQueryValues(entity.AllAttributes())
		err = rows.Scan(values...)
		if err != nil {
			panic(err.Error())
		}
		instances = append(instances, convertValuesToEntity(values, entity.AllAttributes()))
	}

	return instances
}

func (con *Session) QueryByIds(entity *graph.Entity, ids []interface{}) []InsanceData {
	var instances []map[string]interface{}
	builder := dialect.GetSQLBuilder()
	sql := builder.BuildQueryByIdsSQL(entity, len(ids))
	rows, err := con.Dbx.Query(sql, ids...)
	defer rows.Close()
	if err != nil {
		panic(err.Error())
	}
	for rows.Next() {
		values := makeEntityQueryValues(entity.AllAttributes())
		err = rows.Scan(values...)
		if err != nil {
			panic(err.Error())
		}
		instances = append(instances, convertValuesToEntity(values, entity.AllAttributes()))
	}

	return instances
}

func (con *Session) BatchRealAssociations(
	association *graph.Association,
	ids []uint64,
	args graph.QueryArg,
) []InsanceData {
	var instances []map[string]interface{}
	var paramsList []interface{}

	builder := dialect.GetSQLBuilder()
	typeEntity := association.TypeEntity()
	whereArgs := args[consts.ARG_WHERE]
	argEntity := graph.BuildArgEntity(
		typeEntity,
		whereArgs,
		con,
	)

	queryStr := builder.BuildBatchAssociationBodySQL(argEntity,
		typeEntity.AllAttributes(),
		association.Relation.Table.Name,
		association.Owner().TableName(),
		association.TypeEntity().TableName(),
		ids,
	)

	if where, ok := whereArgs.(graph.QueryArg); ok {
		whereSQL, params := builder.BuildWhereSQL(argEntity, typeEntity.AllAttributes(), where)
		if whereSQL != "" {
			queryStr = queryStr + " AND " + whereSQL
		}
		paramsList = append(paramsList, params...)
	}

	queryStr = queryStr + builder.BuildOrderBySQL(argEntity, args[consts.ARG_ORDERBY])
	log.Println("doBatchRealAssociations SQL:	", queryStr)
	rows, err := con.Dbx.Query(queryStr, paramsList...)
	defer rows.Close()
	if err != nil {
		log.Println("出错SQL:", queryStr)
		log.Panic(err.Error())
	}

	for rows.Next() {
		values := makeEntityQueryValues(typeEntity.AllAttributes())
		var idValue db.NullUint64
		values = append(values, &idValue)
		err = rows.Scan(values...)
		if err != nil {
			panic(err.Error())
		}
		instance := convertValuesToEntity(values, typeEntity.AllAttributes())
		instance[consts.ASSOCIATION_OWNER_ID] = values[len(values)-1].(*db.NullUint64).Uint64
		instances = append(instances, instance)
	}

	return instances
}

func merageInstances(source []InsanceData, target []InsanceData) {
	for i := range source {
		souceObj := source[i]
		for j := range target {
			targetObj := target[j]
			if souceObj[consts.ID] == targetObj[consts.ID] {
				targetObj[consts.ASSOCIATION_OWNER_ID] = souceObj[consts.ASSOCIATION_OWNER_ID]
				source[i] = targetObj
			}
		}
	}
}
