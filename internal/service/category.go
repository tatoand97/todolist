package service

import (
    "context"

    "todolist/internal/domain"
    "todolist/internal/repository"
)

type CategoryService struct {
    repo repository.CategoryRepository
}

func NewCategoryService(repo repository.CategoryRepository) *CategoryService {
    return &CategoryService{repo: repo}
}

func (s *CategoryService) Create(ctx context.Context, c *domain.Category) error {
    return s.repo.Create(ctx, c)
}

func (s *CategoryService) Update(ctx context.Context, c *domain.Category) error {
    return s.repo.Update(ctx, c)
}

func (s *CategoryService) Delete(ctx context.Context, id uint, userID uint) error {
    return s.repo.Delete(ctx, id, userID)
}

func (s *CategoryService) Get(ctx context.Context, id uint, userID uint) (*domain.Category, error) {
    return s.repo.Get(ctx, id, userID)
}

func (s *CategoryService) List(ctx context.Context, userID uint) ([]domain.Category, error) {
    return s.repo.List(ctx, userID)
}
