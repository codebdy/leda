package table

import "codebdy.com/leda/services/entify/model/meta"

type Column struct {
	meta.AttributeMeta
	Key bool
}
