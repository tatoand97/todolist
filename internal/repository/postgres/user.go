package postgres

import (
    "context"

    "gorm.io/gorm"

    "todolist/internal/domain"
    "todolist/internal/repository"
)

type UserRepository struct {
    db *gorm.DB
}

func NewUserRepository(db *gorm.DB) repository.UserRepository {
    return &UserRepository{db: db}
}

func (r *UserRepository) Create(ctx context.Context, user *domain.User) error {
    return r.db.WithContext(ctx).Create(user).Error
}

func (r *UserRepository) GetByUsername(ctx context.Context, username string) (*domain.User, error) {
    var u domain.User
    if err := r.db.WithContext(ctx).Where("username = ?", username).First(&u).Error; err != nil {
        return nil, err
    }
    return &u, nil
}
