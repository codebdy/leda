package storage

import (
	"fmt"
	"log"

	"codebdy.com/leda/services/entify/consts"
	"github.com/artdarek/go-unzip"
)

func Unzip(src, dest string) error {
	staticPath := fmt.Sprintf("./%s/", consts.STATIC_PATH)
	uz := unzip.New(staticPath+src, staticPath+dest)
	err := uz.Extract()
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}
