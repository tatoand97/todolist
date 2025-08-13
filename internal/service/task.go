package service

import (
    "context"
    "errors"

    "todolist/internal/domain"
    "todolist/internal/repository"
)

var allowedStates = map[string]bool{
    "Sin Empezar": true,
    "Empezada":   true,
    "Finalizada": true,
}

type TaskService struct {
    repo repository.TaskRepository
}

func NewTaskService(repo repository.TaskRepository) *TaskService {
    return &TaskService{repo: repo}
}

func (s *TaskService) Create(ctx context.Context, t *domain.Task) error {
    if t.State == "" {
        t.State = "Sin Empezar"
    } else if !allowedStates[t.State] {
        return errors.New("invalid state")
    }
    return s.repo.Create(ctx, t)
}

func (s *TaskService) Update(ctx context.Context, t *domain.Task) error {
    if t.State != "" && !allowedStates[t.State] {
        return errors.New("invalid state")
    }
    return s.repo.Update(ctx, t)
}

func (s *TaskService) Delete(ctx context.Context, id uint, userID uint) error {
    return s.repo.Delete(ctx, id, userID)
}

func (s *TaskService) Get(ctx context.Context, id uint, userID uint) (*domain.Task, error) {
    return s.repo.Get(ctx, id, userID)
}

func (s *TaskService) List(ctx context.Context, userID uint, f repository.TaskFilter) ([]domain.Task, error) {
    return s.repo.List(ctx, userID, f)
}
