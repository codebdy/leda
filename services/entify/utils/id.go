package utils

const (
	SERVICE_BITS   = 52
	ENTITY_ID_BITS = 32
)

func EncodeBaseId(appId uint64, entityInnerId uint64, idNoShift bool) uint64 {
	if idNoShift {
		return 0
	}
	return appId<<SERVICE_BITS + entityInnerId<<ENTITY_ID_BITS
}

func DecodeEntityInnerId(appId uint64, id uint64) uint64 {
	//APP
	if id>>ENTITY_ID_BITS == 0 {
		return 1
	}
	return (id - appId<<SERVICE_BITS) >> ENTITY_ID_BITS
}
