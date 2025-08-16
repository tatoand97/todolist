package interfaces

import (
	"context"
	"todolist/internal/domain/entities"
)

// CategoryRepository defines the persistence behavior required by the
// application layer. Implementations live in the infrastructure package.
type CategoryRepository interface {
	Create(ctx context.Context, category *entities.Category) error
	Update(ctx context.Context, category *entities.Category) error
	Delete(ctx context.Context, id uint, userID uint) error
	Get(ctx context.Context, id uint, userID uint) (*entities.Category, error)
	List(ctx context.Context, userID uint) ([]entities.Category, error)
}
