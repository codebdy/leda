package utils

const (
	SERVICE_BITS   = 52 //暂时未用
	ENTITY_ID_BITS = 32
)

func EncodeBaseId(entityInnerId uint64) uint64 {
	if entityInnerId == 0 {
		return 0
	}
	return entityInnerId << ENTITY_ID_BITS
}

func DecodeEntityInnerId(id uint64) uint64 {
	//系统表
	if id>>ENTITY_ID_BITS == 0 {
		return 0
	}
	return id >> ENTITY_ID_BITS
}
