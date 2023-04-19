package parser

import (
	"codebdy.com/leda/services/models/consts"
	"codebdy.com/leda/services/models/modules/app/resolve"
	"github.com/graphql-go/graphql"
)

//var Cache TypeCache

var EntityType *graphql.Union

var fileOutputType = graphql.NewObject(
	graphql.ObjectConfig{
		Name: consts.FILE,
		Fields: graphql.Fields{
			consts.FILE_NAME: &graphql.Field{
				Type: graphql.String,
			},
			consts.FILE_SIZE: &graphql.Field{
				Type: graphql.Int,
			},
			consts.FILE_MIMETYPE: &graphql.Field{
				Type: graphql.String,
			},
			consts.FILE_URL: &graphql.Field{
				Type:    graphql.String,
				Resolve: resolve.FileUrlResolve,
			},
			consts.File_EXTNAME: &graphql.Field{
				Type: graphql.String,
			},
			consts.FILE_THMUBNAIL: &graphql.Field{
				Type: graphql.String,
			},
			consts.FILE_RESIZE: &graphql.Field{
				Type: graphql.String,
				Args: graphql.FieldConfigArgument{
					consts.FILE_WIDTH: &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
					consts.FILE_HEIGHT: &graphql.ArgumentConfig{
						Type: graphql.Int,
					},
				},
			},
		},
		Description: "File type",
	},
)
