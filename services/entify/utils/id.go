package utils

import (
	"rxdrag.com/entify/config"
)

const (
	SERVICE_BITS   = 52
	ENTITY_ID_BITS = 32
)

func EncodeBaseId(entityInnerId uint64, idNoShift bool) uint64 {
	if idNoShift {
		return 0
	}
	return uint64(config.ServiceId())<<SERVICE_BITS + entityInnerId<<ENTITY_ID_BITS
}

func DecodeEntityInnerId(id uint64) uint64 {
	//APP
	if id>>ENTITY_ID_BITS == 0 {
		return 1
	}
	return (id - uint64(config.ServiceId())<<SERVICE_BITS) >> ENTITY_ID_BITS
}
