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

func (s *CategoryService) Create(ctx context.Context, category *entities.Category) error {
	if err := validations.ValidateNewCategory(category); err != nil {
		return err
	}

	return s.repo.Create(ctx, category)
}

func (s *CategoryService) Update(ctx context.Context, category *entities.Category) error {
	if err := validations.ValidateUpdate(category); err != nil {
		return err
	}
	return s.repo.Update(ctx, category)
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
