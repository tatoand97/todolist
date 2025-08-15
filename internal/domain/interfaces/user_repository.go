package interfaces

import (
	"context"
	"todolist/internal/domain/entities"
)

// UserRepository defines persistence behavior for users.
type UserRepository interface {
	Create(ctx context.Context, user *entities.User) error
	GetByUsername(ctx context.Context, username string) (*entities.User, error)
}
