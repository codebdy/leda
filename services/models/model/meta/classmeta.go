package meta

const (
	CLASSS_ENTITY      string = "Entity"
	CLASSS_ENUM        string = "Enum"
	CLASSS_ABSTRACT    string = "Abstract"
	CLASS_VALUE_OBJECT string = "ValueObject"
)

type ClassMeta struct {
	Uuid        string          `json:"uuid"`
	InnerId     uint64          `json:"innerId"`
	Name        string          `json:"name"`
	Label       string          `json:"label"`
	StereoType  string          `json:"stereoType"`
	Attributes  []AttributeMeta `json:"attributes"`
	Methods     []MethodMeta    `json:"methods"`
	Root        bool            `json:"root"`
	Description string          `json:"description"`
	SoftDelete  bool            `json:"softDelete"`
	PackageUuid string          `json:"packageUuid"`
	OnCreated   string          `json:"onCreated"`
	OnUpdated   string          `json:"onUpdated"`
	OnDeleted   string          `json:"onDeleted"`
	//生成表名时使用,运行时动态注入，不持久化
	AppId uint64
}
