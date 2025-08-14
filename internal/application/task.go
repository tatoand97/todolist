package application

import (
	stdcontext "context"
	"errors"

	"todolist/internal/domain"
)

var allowedStates = map[string]bool{
	"Sin Empezar": true,
	"Empezada":    true,
	"Finalizada":  true,
}

type TaskService struct {
	repo domain.TaskRepository
}

func NewTaskService(repo domain.TaskRepository) *TaskService {
	return &TaskService{repo: repo}
}

func (service *TaskService) Create(requestContext stdcontext.Context, task *domain.Task) error {
	if task.State == "" {
		task.State = "Sin Empezar"
	} else if !allowedStates[task.State] {
		return errors.New("invalid state")
	}
	return service.repo.Create(requestContext, task)
}

func (service *TaskService) Update(requestContext stdcontext.Context, task *domain.Task) error {
	if task.State != "" && !allowedStates[task.State] {
		return errors.New("invalid state")
	}
	return service.repo.Update(requestContext, task)
}

func (service *TaskService) Delete(requestContext stdcontext.Context, id uint, userID uint) error {
	return service.repo.Delete(requestContext, id, userID)
}

func (service *TaskService) Get(requestContext stdcontext.Context, id uint, userID uint) (*domain.Task, error) {
	return service.repo.Get(requestContext, id, userID)
}

func (service *TaskService) List(requestContext stdcontext.Context, userID uint, filter domain.TaskFilter) ([]domain.Task, error) {
	return service.repo.List(requestContext, userID, filter)
}
