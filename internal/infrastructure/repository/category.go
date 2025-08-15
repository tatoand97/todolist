package repository

import (
	"context"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"

	"gorm.io/gorm"
)

type categoryRepository struct {
	db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) interfaces.CategoryRepository {
	return &categoryRepository{db: db}
}

func (r *categoryRepository) Create(ctx context.Context, c *entities.Category) error {
	return r.db.WithContext(ctx).Create(c).Error
}

func (r *categoryRepository) Update(ctx context.Context, c *entities.Category) error {
	return r.db.WithContext(ctx).Save(c).Error
}

func (r *categoryRepository) Delete(ctx context.Context, id uint, userID uint) error {
	return r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&entities.Category{}).Error
}

func (r *categoryRepository) Get(ctx context.Context, id uint, userID uint) (*entities.Category, error) {
	var c entities.Category
	if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&c).Error; err != nil {
		return nil, err
	}
	return &c, nil
}

func (r *categoryRepository) List(ctx context.Context, userID uint) ([]entities.Category, error) {
	var categories []entities.Category
	if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&categories).Error; err != nil {
		return nil, err
	}
	return categories, nil
}
