package utils

const (
	SERVICE_BITS   = 52
	ENTITY_ID_BITS = 32
)

func EncodeBaseId(appId uint64, entityInnerId uint64) uint64 {
	if entityInnerId == 0 {
		return 0
	}
	return appId<<SERVICE_BITS + entityInnerId<<ENTITY_ID_BITS
}

func DecodeEntityInnerId(appId uint64, id uint64) uint64 {
	//系统表
	if id>>ENTITY_ID_BITS == 0 {
		return 0
	}
	return (id - appId<<SERVICE_BITS) >> ENTITY_ID_BITS
}
