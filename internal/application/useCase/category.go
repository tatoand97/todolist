package useCase

import (
	"context"
	"todolist/internal/application/validations"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"
)

type CategoryService struct {
	repo interfaces.CategoryRepository
}

func NewCategoryService(repo interfaces.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (s *CategoryService) Create(ctx context.Context, c *entities.Category) error {
	if err := validations.ValidateNewCategory(c); err != nil {
		return err
	}

	return s.repo.Create(ctx, c)
}

func (s *CategoryService) Update(ctx context.Context, c *entities.Category) error {
	if err := validations.ValidateUpdate(c); err != nil {
		return err
	}
	return s.repo.Update(ctx, c)
}

func (s *CategoryService) Delete(ctx context.Context, id uint, userID uint) error {
	return s.repo.Delete(ctx, id, userID)
}

func (s *CategoryService) Get(ctx context.Context, id uint, userID uint) (*entities.Category, error) {
	return s.repo.Get(ctx, id, userID)
}

func (s *CategoryService) List(ctx context.Context, userID uint) ([]entities.Category, error) {
	return s.repo.List(ctx, userID)
}
