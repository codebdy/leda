package meta

import (
	"encoding/json"
	"io/ioutil"
	"log"

	"rxdrag.com/entify/consts"
)

func readContentFromJson() MetaContent {
	data, err := ioutil.ReadFile("./seeds/meta.json")
	content := MetaContent{}
	if nil != err {
		log.Panic(err.Error())
	} else {
		err = json.Unmarshal(data, &content)
	}

	return content
}

var SystemAppData map[string]interface{}

func init() {
	content := readContentFromJson()
	SystemAppData = map[string]interface{}{
		"id":            SYSTEM_APP_ID,
		"uuid":          "SYSTEM-APP-UUID",
		"title":         "Appx",
		"meta":          content,
		"publishedMeta": content,
	}
}

// var systemAppMeta = MetaContent{
// 	Packages: []PackageMeta{
// 		{
// 			Name:   "System",
// 			System: true,
// 			Uuid:   PACKAGE_SYSTEM_UUID,
// 		},
// 	},
// 	Classes: []ClassMeta{
// 		AppClass,
// 		UserClass,
// 		RoleClass,
// 	},
// 	Relations: Relations,
// }

//=============>以下定义只是备份，暂时使用seeds JSON文件中的定义
var AppClass = ClassMeta{
	Uuid:       APP_ENTITY_UUID,
	Name:       APP_ENTITY_NAME,
	InnerId:    APP_INNER_ID,
	StereoType: CLASSS_ENTITY,
	IdNoShift:  true,
	Root:       true,
	System:     true,
	Attributes: []AttributeMeta{
		{
			Name:      consts.ID,
			Primary:   true,
			Type:      ID,
			TypeLabel: ID,
			Uuid:      "APP_COLUMN_ID_UUID",
			System:    true,
		},
		{
			Name:      "uuid",
			Type:      STRING,
			TypeLabel: STRING,
			Uuid:      "APP_COLUMN_UUID_UUID",
			System:    true,
		},
		{
			Name:      "title",
			Type:      STRING,
			TypeLabel: STRING,
			Uuid:      "APP_COLUMN_NAME_UUID",
			System:    true,
		},
		{
			Name:      "meta",
			Type:      JSON,
			TypeLabel: JSON,
			Uuid:      "APP_COLUMN_META_UUID",
			System:    true,
			Nullable:  true,
		},
		{
			Name:      "publishedMeta",
			Type:      JSON,
			TypeLabel: JSON,
			Uuid:      "APP_COLUMN_PUBLISH_META_UUID",
			System:    true,
			Nullable:  true,
		},
		{
			Name:       "createdAt",
			Type:       DATE,
			TypeLabel:  DATE,
			CreateDate: true,
			Uuid:       "APP_COLUMN_CREATED_AT_UUID",
			System:     true,
		},
		{
			Name:       "updatedAt",
			Type:       DATE,
			TypeLabel:  DATE,
			UpdateDate: true,
			Uuid:       "APP_COLUMN_UPDATEED_AT_UUID",
			System:     true,
			Nullable:   true,
		},
		{
			Name:      "saveMetaAt",
			Type:      DATE,
			TypeLabel: DATE,
			Uuid:      "APP_COLUMN_SAVE_META_AT_UUID",
			System:    true,
			Nullable:  true,
		},
		{
			Name:      "publishMetaAt",
			Type:      DATE,
			TypeLabel: DATE,
			Uuid:      "APP_COLUMN_PUBLISH_META_AT_UUID",
			System:    true,
			Nullable:  true,
		},
	},
	PackageUuid: PACKAGE_SYSTEM_UUID,
}

var UserClass = ClassMeta{
	PackageUuid: PACKAGE_SYSTEM_UUID,
	InnerId:     USER_INNER_ID,
	Name:        USER_ENTITY_NAME,
	Root:        true,
	StereoType:  CLASSS_ENTITY,
	Uuid:        USER_ENTITY_UUID,
	System:      true,
	Attributes: []AttributeMeta{
		{
			System:    true,
			Name:      consts.ID,
			Primary:   true,
			Type:      ID,
			TypeLabel: ID,
			Uuid:      "RX_USER_ID_UUID",
		},
		{
			System:    true,
			Name:      "name",
			Nullable:  true,
			Type:      STRING,
			TypeLabel: STRING,
			Uuid:      "RX_USER_NAME_UUID",
		},
		{
			System:    true,
			Length:    128,
			Name:      "loginName",
			Type:      STRING,
			TypeLabel: STRING,
			Uuid:      "RX_USER_LOGINNAME_UUID",
		},
		{
			System:    true,
			Length:    256,
			Name:      "password",
			Type:      STRING,
			TypeLabel: STRING,
			Uuid:      "RX_USER_PASSWORD_UUID",
		},
		{
			System:    true,
			Name:      "isSupper",
			Nullable:  true,
			Type:      BOOLEAN,
			TypeLabel: BOOLEAN,
			Uuid:      "RX_USER_ISSUPPER_UUID",
		},
		{
			System:    true,
			Name:      "isDemo",
			Nullable:  true,
			Type:      BOOLEAN,
			TypeLabel: BOOLEAN,
			Uuid:      "RX_USER_ISDEMO_UUID",
		},
		{
			System:     true,
			CreateDate: true,
			Name:       "createdAt",
			Type:       DATE,
			TypeLabel:  DATE,
			Uuid:       "RX_USER_CREATEDAT_UUID",
		},
		{
			System:     true,
			Name:       "updatedAt",
			Type:       DATE,
			TypeLabel:  DATE,
			UpdateDate: true,
			Uuid:       "RX_USER_UPDATEDAT_UUID",
		},
	},
}

var RoleClass = ClassMeta{
	PackageUuid: PACKAGE_SYSTEM_UUID,
	InnerId:     ROLE_INNER_ID,
	Name:        ROLE_ENTITY_NAME,
	Root:        true,
	StereoType:  CLASSS_ENTITY,
	Uuid:        ROLE_ENTITY_UUID,
	System:      true,
	Attributes: []AttributeMeta{
		{
			System:    true,
			Name:      consts.ID,
			Primary:   true,
			Type:      ID,
			TypeLabel: ID,
			Uuid:      "RX_ROLE_ID_UUID",
		},
		{
			System:    true,
			Name:      "name",
			Type:      "String",
			TypeLabel: "String",
			Uuid:      "RX_ROLE_NAME_UUID",
		},
		{
			System:    true,
			Name:      "description",
			Nullable:  true,
			Type:      "String",
			TypeLabel: "String",
			Uuid:      "RX_ROLE_DESCRIPTION_UUID",
		},
		{
			System:     true,
			CreateDate: true,
			Name:       "createdAt",
			Type:       DATE,
			TypeLabel:  DATE,
			Uuid:       "RX_ROLE_CREATEDAT_UUID",
		},
		{
			System:     true,
			Name:       "updatedAt",
			Type:       DATE,
			TypeLabel:  DATE,
			UpdateDate: true,
			Uuid:       "RX_ROLE_META_UPDATEDAT_UUID",
		},
	},
}

var Relations = []RelationMeta{
	{
		InnerId:            ROLE_USER_RELATION_INNER_ID,
		RelationType:       "twoWayAssociation",
		RoleOfSource:       "roles",
		RoleOfTarget:       "users",
		SourceId:           ROLE_ENTITY_UUID,
		SourceMutiplicity:  "0..*",
		TargetId:           USER_ENTITY_UUID,
		TargetMultiplicity: "0..*",
		Uuid:               "META_RELATION_USER_ROLE_UUID",
	},
}
