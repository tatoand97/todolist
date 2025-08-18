package interfaces

import (
	"context"
	"todolist/internal/domain/entities"
)

type TaskFilter struct {
	CategoryID *uint
	State      *string
	Page       int
	PageSize   int
}

// TaskRepository defines the persistence behavior for tasks.
type TaskRepository interface {
	Create(ctx context.Context, task *entities.Task) error
	Update(ctx context.Context, task *entities.Task) error
	Delete(ctx context.Context, id uint, userID uint) error
	Get(ctx context.Context, id uint, userID uint) (*entities.Task, error)
	List(ctx context.Context, userID uint, filter TaskFilter) ([]entities.Task, int64, error)
}
