package entities

import "time"

type OneShotTask struct {
	Id          int64     `json:"id"`
	Name        string    `json:"name"`
	ExecuteTime time.Time `json:"excuteTime"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdatedAt   time.Time `json:"updatedAt"`
}
