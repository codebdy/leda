package entities

import "time"

type Task struct {
	//任务类型，客户端自己用于区分各种任务
	Type           string     `json:"type"`
	Id             int64      `json:"id"`
	Name           string     `json:"name"`
	CronExpression string     `json:"cronExpression"`
	Status         string     `json:"status"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
	Config         TaskConfig `json:"config"`
}
