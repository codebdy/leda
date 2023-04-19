package meta

type AttributeMeta struct {
	Uuid          string `json:"uuid"`
	Type          string `json:"type"`
	Primary       bool   `json:"primary"`
	Name          string `json:"name"`
	Label         string `json:"label"`
	Nullable      bool   `json:"nullable"`
	Default       string `json:"default"`
	Unique        bool   `json:"unique"`
	Index         bool   `json:"index"`
	CreateDate    bool   `json:"createDate"`
	UpdateDate    bool   `json:"updateDate"`
	DeleteDate    bool   `json:"deleteDate"`
	Hidden        bool   `json:"hidden"`
	Length        int    `json:"length"`
	FloatM        int    `json:"floatM"` //M digits in total
	FloatD        int    `json:"floatD"` //D digits may be after the decimal point
	Unsigned      bool   `json:"unsigned"`
	TypeUuid      string `json:"typeUuid"`
	Readonly      bool   `json:"readonly"`
	Description   string `json:"description"`
	TypeLabel     string `json:"typeLabel"`
	System        bool   `json:"system"`
	AutoIncrement bool   `json:"autoIncrement"`
	AutoGenerate  bool   `json:"autoGenerate"`
}
