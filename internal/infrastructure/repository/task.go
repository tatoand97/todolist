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

func (r *taskRepository) Create(ctx context.Context, task *entities.Task) error {
	return r.db.WithContext(ctx).Create(task).Error
}

func (r *taskRepository) Update(ctx context.Context, task *entities.Task) error {
	return r.db.WithContext(ctx).Save(task).Error
}

func (r *taskRepository) Delete(ctx context.Context, id uint, userID uint) error {
	return r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).Delete(&entities.Task{}).Error
}

func (r *taskRepository) Get(ctx context.Context, id uint, userID uint) (*entities.Task, error) {
	var task entities.Task
	if err := r.db.WithContext(ctx).Where("id = ? AND user_id = ?", id, userID).First(&task).Error; err != nil {
		return nil, err
	}
	return &task, nil
}

func (r *taskRepository) List(ctx context.Context, userID uint, filter interfaces.TaskFilter) ([]entities.Task, int64, error) {
	var tasks []entities.Task
	query := r.db.WithContext(ctx).Where("user_id = ?", userID)
	if filter.CategoryID != nil {
		query = query.Where("category_id = ?", *filter.CategoryID)
	}
	if filter.State != nil {
		query = query.Where("state = ?", *filter.State)
	}

	var total int64
	if err := query.Model(&entities.Task{}).Count(&total).Error; err != nil {
		return nil, 0, err
	}

	if filter.PageSize > 0 {
		query = query.Limit(filter.PageSize)
	}
	if filter.Page > 0 && filter.PageSize > 0 {
		offset := (filter.Page - 1) * filter.PageSize
		query = query.Offset(offset)
	}

	if err := query.Find(&tasks).Error; err != nil {
		return nil, 0, err
	}
	return tasks, total, nil
}
