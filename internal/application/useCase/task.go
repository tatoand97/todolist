package useCase

import (
	"context"
	"errors"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"
)

var allowedStates = map[string]bool{
	"Sin Empezar": true,
	"Empezada":    true,
	"Finalizada":  true,
}

type TaskService struct {
	repo interfaces.TaskRepository
}

func NewTaskService(repo interfaces.TaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

func (s *TaskService) Create(ctx context.Context, task *entities.Task) error {
	if task.State == "" {
		task.State = "Sin Empezar"
	} else if !allowedStates[task.State] {
		return errors.New("invalid state")
	}
	return s.repo.Create(ctx, task)
}

func (s *TaskService) Update(ctx context.Context, task *entities.Task) error {
	if task.State != "" && !allowedStates[task.State] {
		return errors.New("invalid state")
	}
	return s.repo.Update(ctx, task)
}

func (s *TaskService) Delete(ctx context.Context, id uint, userID uint) error {
	return s.repo.Delete(ctx, id, userID)
}

func (s *TaskService) Get(ctx context.Context, id uint, userID uint) (*entities.Task, error) {
	return s.repo.Get(ctx, id, userID)
}

func (s *TaskService) List(ctx context.Context, userID uint, filter interfaces.TaskFilter) ([]entities.Task, int64, error) {
	return s.repo.List(ctx, userID, filter)
}
