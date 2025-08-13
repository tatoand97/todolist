package domain

import "context"

// TaskFilter captures optional filters for querying tasks.
type TaskFilter struct {
	CategoryID *uint
	State      *string
}

// TaskRepository defines the persistence behavior for tasks.
type TaskRepository interface {
	Create(ctx context.Context, t *Task) error
	Update(ctx context.Context, t *Task) error
	Delete(ctx context.Context, id uint, userID uint) error
	Get(ctx context.Context, id uint, userID uint) (*Task, error)
	List(ctx context.Context, userID uint, f TaskFilter) ([]Task, error)
}
