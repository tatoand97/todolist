package domain

import "context"

// CategoryRepository defines the persistence behavior required by the
// application layer. Implementations live in the infrastructure package.
type CategoryRepository interface {
	Create(ctx context.Context, c *Category) error
	Update(ctx context.Context, c *Category) error
	Delete(ctx context.Context, id uint, userID uint) error
	Get(ctx context.Context, id uint, userID uint) (*Category, error)
	List(ctx context.Context, userID uint) ([]Category, error)
}
