package meta

const (
	PACKAGE_NORMAL     = "Normal"
	PACKAGE_THIRDPARTY = "ThirdParty"
)

type PackageMeta struct {
	Uuid       string `json:"uuid"`
	Name       string `json:"name"`
	Label      string `json:"label"`
	System     bool   `json:"system"`
	StereoType string `json:"stereoType"`
	Sharable   bool   `json:"sharable"`
}
