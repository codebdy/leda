package table

import "codebdy.com/leda/services/models/entify/model/meta"

type Column struct {
	meta.AttributeMeta
	Key bool
}
