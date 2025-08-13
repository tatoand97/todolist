package postgres

import (
	"context"

	"gorm.io/gorm"

	"todolist/internal/domain"
)

type TaskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) domain.TaskRepository {
	return &TaskRepository{db: db}
}

func (r *TaskRepository) Create(ctx context.Context, t *domain.Task) error {
	return r.db.WithContext(ctx).Create(t).Error
}

func (r *TaskRepository) Update(ctx context.Context, t *domain.Task) error {
	return r.db.WithContext(ctx).Save(t).Error
}

func (r *TaskRepository) Delete(ctx context.Context, id uint, userID uint) error {
	return r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&domain.Task{}).Error
}

func (r *TaskRepository) Get(ctx context.Context, id uint, userID uint) (*domain.Task, error) {
	var t domain.Task
	if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *TaskRepository) List(ctx context.Context, userID uint, f domain.TaskFilter) ([]domain.Task, error) {
	var tasks []domain.Task
	q := r.db.WithContext(ctx).Where("user_id = ?", userID)
	if f.CategoryID != nil {
		q = q.Where("category_id = ?", *f.CategoryID)
	}
	if f.State != nil {
		q = q.Where("state = ?", *f.State)
	}
	if err := q.Find(&tasks).Error; err != nil {
		return nil, err
	}
	return tasks, nil
}
