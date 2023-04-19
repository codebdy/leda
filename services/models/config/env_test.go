package config

import (
	"testing"

	"codebdy.com/leda/services/models/consts"
)

func TestGetString(t *testing.T) {
	if GetString(consts.DB_DRIVER) != "mysql" {
		t.Error("Getstring Error:" + GetString(consts.DB_DRIVER))
	}
}
