package install

func loadAuthMeta() *meta.UMLMeta {

	authContent := ledasdk.ReadContentFromJson("./seeds/auth-meta.json")
	return &authContent
}

s, err := rep.OpenSession()
if err != nil {
	panic(err.Error())
}

func authMetaMap(authMeta *meta.UMLMeta) map[string]interface{} {

	return map[string]interface{}{
		consts.NAME:                   "authMeta",
		consts.META_CONTENT:           authMeta,
		consts.META_PUBLISHED_CONTENT: authMeta,
		consts.META_PUBLISHEDAT:       time.Now(),
		consts.META_CREATEDAT:         time.Now(),
		consts.META_UPDATEDAT:         time.Now(),
	}
}

func authServiceMap(metaId uint64) map[string]interface{} {

	return map[string]interface{}{
		consts.NAME:           "authService",
		"metaId":              metaId,
		"isSystem":            true,
		consts.META_CREATEDAT: time.Now(),
		consts.META_UPDATEDAT: time.Now(),
	}
}

authUmlMeta := loadAuthMeta()
authMetaMp := authMetaMap(authUmlMeta)

	//nextMeta = authUmlMeta
	//rep.PublishMeta(&meta.UMLMeta{}, nextMeta, 0)

		//插入 Meta
		authMetaId, err := s.SaveOne(consts.META_ENTITY_NAME, authMetaMp)

		if err != nil || authMetaId == 0 {
			log.Panic(err.Error())
		}
	
		// 插入 Service
		authServiceId, err := s.SaveOne(consts.SERVICE_ENTITY_NAME, authServiceMap(authMetaId))
		if err != nil || authServiceId == 0 {
			log.Panic(err.Error())
		}


		
func adminInstance(name string, password string) map[string]interface{} {
	return map[string]interface{}{
		consts.NAME:           "Admin",
		consts.LOGIN_NAME:     name,
		consts.PASSWORD:       password,
		consts.IS_SUPPER:      true,
		consts.META_CREATEDAT: time.Now(),
		consts.META_UPDATEDAT: time.Now(),
	}
}

func demoInstance() map[string]interface{} {
	return map[string]interface{}{
		consts.NAME:           "Demo",
		consts.LOGIN_NAME:     "demo",
		consts.PASSWORD:       "demo",
		consts.IS_DEMO:        true,
		consts.META_CREATEDAT: time.Now(),
		consts.META_UPDATEDAT: time.Now(),
	}
}
