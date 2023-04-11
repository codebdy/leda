package resolver

import (
	"context"
)

func (*Resolver) StartOneShotTask(ctx context.Context, args struct {
	ID string
}) string {
	return "StartOneShotTask !"
}

func (*Resolver) StartPeriodicTask(ctx context.Context, args struct {
	ID string
}) string {
	return "startPeriodicTask !"
}

func (*Resolver) CancelOneShotTask(ctx context.Context, args struct {
	ID string
}) string {
	return "cancelOneShotTask !"
}

func (*Resolver) CancelPeriodicTask(ctx context.Context, args struct {
	ID string
}) string {
	return "cancelPeriodicTask !"
}

func (*Resolver) PausedPeriodicTask(ctx context.Context, args struct {
	ID string
}) string {
	return "pausedPeriodicTask !"
}
