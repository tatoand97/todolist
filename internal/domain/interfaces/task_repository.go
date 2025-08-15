package interfaces

import (
	"context"
	"todolist/internal/domain/entities"
)

// TaskFilter captures optional filters for querying tasks.
type TaskFilter struct {
	CategoryID *uint
	State      *string
}

// TaskRepository defines the persistence behavior for tasks.
type TaskRepository interface {
	Create(ctx context.Context, t *entities.Task) error
	Update(ctx context.Context, t *entities.Task) error
	Delete(ctx context.Context, id uint, userID uint) error
	Get(ctx context.Context, id uint, userID uint) (*entities.Task, error)
	List(ctx context.Context, userID uint, f TaskFilter) ([]entities.Task, error)
}
