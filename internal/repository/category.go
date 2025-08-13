package repository

import (
    "context"

    "todolist/internal/domain"
)

type CategoryRepository interface {
    Create(ctx context.Context, c *domain.Category) error
    Update(ctx context.Context, c *domain.Category) error
    Delete(ctx context.Context, id uint, userID uint) error
    Get(ctx context.Context, id uint, userID uint) (*domain.Category, error)
    List(ctx context.Context, userID uint) ([]domain.Category, error)
}
