package storage

import (
	"fmt"
	"log"

	"github.com/artdarek/go-unzip"
	"rxdrag.com/entify/consts"
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
