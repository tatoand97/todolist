package postgres

import (
    "context"

    "gorm.io/gorm"

    "todolist/internal/domain"
    "todolist/internal/repository"
)

type CategoryRepository struct {
    db *gorm.DB
}

func NewCategoryRepository(db *gorm.DB) repository.CategoryRepository {
    return &CategoryRepository{db: db}
}

func (r *CategoryRepository) Create(ctx context.Context, c *domain.Category) error {
    return r.db.WithContext(ctx).Create(c).Error
}

func (r *CategoryRepository) Update(ctx context.Context, c *domain.Category) error {
    return r.db.WithContext(ctx).Save(c).Error
}

func (r *CategoryRepository) Delete(ctx context.Context, id uint, userID uint) error {
    return r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Category{}).Error
}

func (r *CategoryRepository) Get(ctx context.Context, id uint, userID uint) (*domain.Category, error) {
    var c domain.Category
    if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&c).Error; err != nil {
        return nil, err
    }
    return &c, nil
}

func (r *CategoryRepository) List(ctx context.Context, userID uint) ([]domain.Category, error) {
    var categories []domain.Category
    if err := r.db.WithContext(ctx).Where("user_id = ?", userID).Find(&categories).Error; err != nil {
        return nil, err
    }
    return categories, nil
}
