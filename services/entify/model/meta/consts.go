package meta

const SYSTEM_APP_ID uint64 = 1

const (
	APP_INNER_ID                = 1
	USER_INNER_ID               = 4
	ROLE_INNER_ID               = 5
	ROLE_USER_RELATION_INNER_ID = 101
)

const (
	PACKAGE_SYSTEM_UUID        = "PACKAGE_SYSTEM_UUID"
	APP_ENTITY_NAME            = "App"
	APP_ENTITY_UUID     string = "APP_ENTITY_UUID"

	USER_ENTITY_NAME = "User"
	USER_ENTITY_UUID = "META_USER_UUID"
	ROLE_ENTITY_NAME = "Role"
	ROLE_ENTITY_UUID = "META_ROLE_UUID"
)

const (
	META_ABILITY_TYPE_CREATE    string = "create"
	META_ABILITY_TYPE_READ      string = "read"
	META_ABILITY_TYPE_UPDATE    string = "update"
	META_ABILITY_TYPE_DELETE    string = "delete"
	META_ABILITY_TYPE_ENUM_UUID string = "META_ABILITY_TYPE_ENUM_UUID"
)
