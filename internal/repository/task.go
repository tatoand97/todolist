package repository

import (
    "context"

    "todolist/internal/domain"
)

type TaskFilter struct {
    CategoryID *uint
    State      *string
}

type TaskRepository interface {
    Create(ctx context.Context, t *domain.Task) error
    Update(ctx context.Context, t *domain.Task) error
    Delete(ctx context.Context, id uint, userID uint) error
    Get(ctx context.Context, id uint, userID uint) (*domain.Task, error)
    List(ctx context.Context, userID uint, f TaskFilter) ([]domain.Task, error)
}
