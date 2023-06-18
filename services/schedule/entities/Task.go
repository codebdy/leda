package entities

import "time"

const TASK_NAME = "Task"

type Task struct {
	Id             int64      `json:"id"`
	Name           string     `json:"name"`
	CronExpression string     `json:"cronExpression"`
	Status         string     `json:"status"`
	CreatedAt      time.Time  `json:"createdAt"`
	UpdatedAt      time.Time  `json:"updatedAt"`
	Config         TaskConfig `json:"config"`
}
