package table

import "codebdy.com/leda/services/models/model/meta"

type Column struct {
	meta.AttributeMeta
	Key bool
}
