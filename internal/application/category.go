package application

import (
	stdcontext "context"

	"todolist/internal/domain"
)

type CategoryService struct {
	repo domain.CategoryRepository
}

func NewCategoryService(repo domain.CategoryRepository) *CategoryService {
	return &CategoryService{repo: repo}
}

func (service *CategoryService) Create(requestContext stdcontext.Context, category *domain.Category) error {
	return service.repo.Create(requestContext, category)
}

func (service *CategoryService) Update(requestContext stdcontext.Context, category *domain.Category) error {
	return service.repo.Update(requestContext, category)
}

func (service *CategoryService) Delete(requestContext stdcontext.Context, id uint, userID uint) error {
	return service.repo.Delete(requestContext, id, userID)
}

func (service *CategoryService) Get(requestContext stdcontext.Context, id uint, userID uint) (*domain.Category, error) {
	return service.repo.Get(requestContext, id, userID)
}

func (service *CategoryService) List(requestContext stdcontext.Context, userID uint) ([]domain.Category, error) {
	return service.repo.List(requestContext, userID)
}
