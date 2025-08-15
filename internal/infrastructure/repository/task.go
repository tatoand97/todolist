package repository

import (
	"context"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"

	"gorm.io/gorm"
)

type taskRepository struct {
	db *gorm.DB
}

func NewTaskRepository(db *gorm.DB) interfaces.TaskRepository {
	return &taskRepository{db: db}
}

func (r *taskRepository) Create(ctx context.Context, t *entities.Task) error {
	return r.db.WithContext(ctx).Create(t).Error
}

func (r *taskRepository) Update(ctx context.Context, t *entities.Task) error {
	return r.db.WithContext(ctx).Save(t).Error
}

func (r *taskRepository) Delete(ctx context.Context, id uint, userID uint) error {
	return r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&entities.Task{}).Error
}

func (r *taskRepository) Get(ctx context.Context, id uint, userID uint) (*entities.Task, error) {
	var t entities.Task
	if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&t).Error; err != nil {
		return nil, err
	}
	return &t, nil
}

func (r *taskRepository) List(ctx context.Context, userID uint, f interfaces.TaskFilter) ([]entities.Task, error) {
	var tasks []entities.Task
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
