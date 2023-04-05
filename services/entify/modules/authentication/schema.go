package authentication

import (
	"errors"

	"github.com/graphql-go/graphql"
	"rxdrag.com/entify/consts"
	"rxdrag.com/entify/utils"
)

func mutationFields() []*graphql.Field {
	return []*graphql.Field{
		{
			Name: consts.LOGIN,
			Type: graphql.String,
			Args: graphql.FieldConfigArgument{
				consts.LOGIN_NAME: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{OfType: graphql.String},
				},
				consts.PASSWORD: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{OfType: graphql.String},
				},
			},
			Resolve: LoginResolveFn(),
		},
		{
			Name:    consts.LOGOUT,
			Type:    graphql.Boolean,
			Resolve: LogoutResolveFn(),
		},
		{
			Name: consts.CHANGE_PASSWORD,
			Type: graphql.String,
			Args: graphql.FieldConfigArgument{
				consts.LOGIN_NAME: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{OfType: graphql.String},
				},
				consts.OLD_PASSWORD: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{OfType: graphql.String},
				},
				consts.New_PASSWORD: &graphql.ArgumentConfig{
					Type: &graphql.NonNull{OfType: graphql.String},
				},
			},
			Resolve: func(p graphql.ResolveParams) (interface{}, error) {
				defer utils.PrintErrorStack()
				if p.Args[consts.LOGIN_NAME] == nil ||
					p.Args["oldPassword"] == nil ||
					p.Args["newPassword"] == nil {
					return "", errors.New("loginName, oldPassword or newPassword is emperty!")
				}
				auth := New()

				return auth.ChangePassword(p.Args[consts.LOGIN_NAME].(string),
					p.Args["oldPassword"].(string),
					p.Args["newPassword"].(string))
			},
		},
	}

}
