package domain

import "context"

// UserRepository defines persistence behavior for users.
type UserRepository interface {
	Create(ctx context.Context, user *User) error
	GetByUsername(ctx context.Context, username string) (*User, error)
}
