package utils

import "golang.org/x/crypto/bcrypt"

func BcryptEncode(value string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(value), bcrypt.DefaultCost)
	if err != nil {
		panic(err.Error())
	}
	encodeValue := string(hash)
	return encodeValue
}
