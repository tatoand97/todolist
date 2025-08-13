package repository

import (
    "context"

    "todolist/internal/domain"
)

type UserRepository interface {
    Create(ctx context.Context, user *domain.User) error
    GetByUsername(ctx context.Context, username string) (*domain.User, error)
}
