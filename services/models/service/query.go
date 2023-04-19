package service

import (
	"log"

	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/model/graph"
	"codebdy.com/leda/services/models/orm"
)

func mergeWhereArgs(whereArgs, authArgs graph.QueryArg) graph.QueryArg {
	if len(whereArgs) == 0 {
		return authArgs
	}

	if len(authArgs) == 0 {
		return whereArgs
	}

	return graph.QueryArg{
		consts.ARG_AND: []graph.QueryArg{
			whereArgs,
			authArgs,
		},
	}
}

func (s *Service) QueryEntity(entity *graph.Entity, args graph.QueryArg, fieldNames []string) orm.QueryResponse {
	canRead, authArgs := s.canReadEntity(entity)
	if !canRead {
		log.Panic("No access")
	}
	session, err := orm.Open()
	if err != nil {
		panic(err.Error())
	}

	fields := []*graph.Attribute{}
	allAttributes := entity.AllAttributes()

	for i := range allAttributes {
		for _, name := range fieldNames {
			if allAttributes[i].Name == name {
				fields = append(fields, allAttributes[i])
			}
		}
	}

	return session.Query(entity, mergeWhereArgs(args, authArgs), fields)
}

func (s *Service) QueryOneEntity(entity *graph.Entity, args graph.QueryArg) interface{} {
	canRead, authArgs := s.canReadEntity(entity)
	if !canRead {
		log.Panic("No access")
	}
	session, err := orm.Open()
	if err != nil {
		log.Panic(err.Error())
	}
	return session.QueryOne(entity, mergeWhereArgs(args, authArgs))
}

func (s *Service) QueryById(entity *graph.Entity, id uint64) interface{} {
	canRead, authArgs := s.canReadEntity(entity)
	if !canRead {
		log.Panic("No access")
	}
	return s.QueryOneEntity(entity, mergeWhereArgs(graph.QueryArg{
		consts.ARG_WHERE: graph.QueryArg{
			consts.ID: graph.QueryArg{
				consts.ARG_EQ: id,
			},
		},
	}, authArgs))
}

func (s *Service) BatchQueryAssociations(
	association *graph.Association,
	ids []uint64,
	args graph.QueryArg,
) []map[string]interface{} {
	session, err := orm.Open()
	if err != nil {
		panic(err.Error())
	}
	return session.BatchRealAssociations(association, ids, args)
}
