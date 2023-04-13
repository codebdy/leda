package schema

import (
	"codebdy.com/leda/services/entify/app/resolve"
	"codebdy.com/leda/services/entify/consts"
	"codebdy.com/leda/services/entify/leda-shared/scalars"
	"codebdy.com/leda/services/entify/model/graph"
	"github.com/graphql-go/graphql"
)

func (a *AppProcessor) mutationFields() []*graphql.Field {
	mutationFields := graphql.Fields{}

	mutationFields[consts.UPLOAD] = &graphql.Field{
		Type: graphql.String,
		Args: graphql.FieldConfigArgument{
			consts.ARG_FILE: &graphql.ArgumentConfig{
				Type: &graphql.NonNull{
					OfType: scalars.UploadType,
				},
			},
		},
		Resolve: resolve.UploadResolveResolve,
	}

	mutationFields[UPLOAD_ZIP] = &graphql.Field{
		Type: graphql.String,
		Args: graphql.FieldConfigArgument{
			consts.ARG_FILE: &graphql.ArgumentConfig{
				Type: &graphql.NonNull{
					OfType: scalars.UploadType,
				},
			},
			consts.ARG_FOLDER: &graphql.ArgumentConfig{
				Type: &graphql.NonNull{
					OfType: graphql.String,
				},
			},
		},
		Resolve: resolve.UploadZipResolveResolve,
	}

	for _, entity := range a.Model.Graph.RootEnities() {
		if entity.Domain.Root {
			a.appendEntityMutationToFields(entity, mutationFields)
		}
	}

	return convertFieldsArray(mutationFields)
}

func (a *AppProcessor) deleteArgs(entity *graph.Entity) graphql.FieldConfigArgument {
	return graphql.FieldConfigArgument{
		consts.ARG_WHERE: &graphql.ArgumentConfig{
			Type: a.modelParser.WhereExp(entity.Name()),
		},
	}
}

func deleteByIdArgs() graphql.FieldConfigArgument {
	return graphql.FieldConfigArgument{
		consts.ID: &graphql.ArgumentConfig{
			Type: graphql.ID,
		},
	}
}

func (a *AppProcessor) upsertArgs(entity *graph.Entity) graphql.FieldConfigArgument {
	return graphql.FieldConfigArgument{
		consts.ARG_OBJECTS: &graphql.ArgumentConfig{
			Type: &graphql.NonNull{
				OfType: &graphql.List{
					OfType: &graphql.NonNull{
						OfType: a.modelParser.SaveInput(entity.Name()),
					},
				},
			},
		},
	}
}

func (a *AppProcessor) upsertOneArgs(entity *graph.Entity) graphql.FieldConfigArgument {
	return graphql.FieldConfigArgument{
		consts.ARG_OBJECT: &graphql.ArgumentConfig{
			Type: &graphql.NonNull{
				OfType: a.modelParser.SaveInput(entity.Name()),
			},
		},
	}
}

func (a *AppProcessor) setArgs(entity *graph.Entity) graphql.FieldConfigArgument {
	updateInput := a.modelParser.SetInput(entity.Name())
	return graphql.FieldConfigArgument{
		consts.ARG_SET: &graphql.ArgumentConfig{
			Type: &graphql.NonNull{
				OfType: updateInput,
			},
		},
		consts.ARG_WHERE: &graphql.ArgumentConfig{
			Type: a.modelParser.WhereExp(entity.Name()),
		},
	}
}

func (a *AppProcessor) appendEntityMutationToFields(entity *graph.Entity, feilds graphql.Fields) {
	(feilds)[entity.DeleteName()] = &graphql.Field{
		Type:    a.modelParser.MutationResponse(entity.Name()),
		Args:    a.deleteArgs(entity),
		Resolve: resolve.DeleteResolveFn(entity, a.Model),
	}
	(feilds)[entity.DeleteByIdName()] = &graphql.Field{
		Type:    a.modelParser.OutputType(entity.Name()),
		Args:    deleteByIdArgs(),
		Resolve: resolve.DeleteByIdResolveFn(entity, a.Model),
	}
	(feilds)[entity.UpsertName()] = &graphql.Field{
		Type:    &graphql.List{OfType: a.modelParser.OutputType(entity.Name())},
		Args:    a.upsertArgs(entity),
		Resolve: resolve.PostResolveFn(entity, a.Model),
	}
	(feilds)[entity.UpsertOneName()] = &graphql.Field{
		Type:    a.modelParser.OutputType(entity.Name()),
		Args:    a.upsertOneArgs(entity),
		Resolve: resolve.PostOneResolveFn(entity, a.Model),
	}

	updateInput := a.modelParser.SetInput(entity.Name())
	if len(updateInput.Fields()) > 0 {
		(feilds)[entity.SetName()] = &graphql.Field{
			Type:    a.modelParser.MutationResponse(entity.Name()),
			Args:    a.setArgs(entity),
			Resolve: resolve.SetResolveFn(entity, a.Model),
		}
	}
}
