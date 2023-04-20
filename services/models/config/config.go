package config

import (
	"fmt"

	"codebdy.com/leda/services/models/consts"
	"github.com/codebdy/entify/db"
)

const TABLE_NAME_MAX_LENGTH = 64

var fileCfg Config
var envCfg Config

type Config interface {
	getString(key string) string
	getBool(key string) bool
	getInt(key string) int
}

func GetString(key string) string {
	str := envCfg.getString(key)
	if str == "" {
		str = fileCfg.getString(key)
	}
	return str
}

func GetBool(key string) bool {
	boolValue := envCfg.getBool(key)
	if !boolValue {
		boolValue = fileCfg.getBool(key)
	}
	return boolValue
}

func GetInt(key string) int {
	intValue := envCfg.getInt(key)
	if intValue == 0 {
		intValue = fileCfg.getInt(key)
	}
	return intValue
}

func GetDbConfig() db.DbConfig {
	var cfg db.DbConfig
	cfg.Driver = GetString(consts.DB_DRIVER)
	cfg.Database = GetString(consts.DB_DATABASE)
	cfg.Host = GetString(consts.DB_HOST)
	cfg.Port = GetString(consts.DB_PORT)
	cfg.User = GetString(consts.DB_USER)
	cfg.Password = GetString(consts.DB_PASSWORD)
	if cfg.Driver == "" {
		cfg.Driver = "mysql"
	}
	return cfg
}

func ServiceId() int {
	serviceId := GetInt(consts.SERVICE_ID)
	if serviceId == 0 {
		fmt.Println("Not set service id, use 1 as service id")
		return 1
	}
	return serviceId
}

func AuthUrl() string {
	return GetString(consts.AUTH_URL)
}

func ZeebeAddress() string {
	return GetString(consts.ZEEBE_ADDRESS)
}

func Storage() string {
	return GetString(consts.STORAGE)
}

func init() {
	fileCfg = newFileConfig()
	envCfg = newEnvConfig()
}
