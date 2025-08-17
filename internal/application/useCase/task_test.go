package useCase

import (
	"context"
	"testing"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"
)

type mockTaskRepo struct {
	listFn func(ctx context.Context, userID uint, filter interfaces.TaskFilter) ([]entities.Task, int64, error)
}

func (m *mockTaskRepo) Create(ctx context.Context, task *entities.Task) error  { return nil }
func (m *mockTaskRepo) Update(ctx context.Context, task *entities.Task) error  { return nil }
func (m *mockTaskRepo) Delete(ctx context.Context, id uint, userID uint) error { return nil }
func (m *mockTaskRepo) Get(ctx context.Context, id uint, userID uint) (*entities.Task, error) {
	return nil, nil
}
func (m *mockTaskRepo) List(ctx context.Context, userID uint, filter interfaces.TaskFilter) ([]entities.Task, int64, error) {
	if m.listFn != nil {
		return m.listFn(ctx, userID, filter)
	}
	return nil, 0, nil
}

func TestTaskServiceList(t *testing.T) {
	repo := &mockTaskRepo{
		listFn: func(ctx context.Context, userID uint, filter interfaces.TaskFilter) ([]entities.Task, int64, error) {
			tasks := []entities.Task{{ID: 1}, {ID: 2}}
			return tasks, 2, nil
		},
	}
	svc := NewTaskService(repo)
	items, total, err := svc.List(context.Background(), 1, interfaces.TaskFilter{Page: 1, PageSize: 10})
	if err != nil {
		t.Fatalf("unexpected error: %v", err)
	}
	if len(items) != 2 {
		t.Fatalf("expected 2 items, got %d", len(items))
	}
	if total != 2 {
		t.Fatalf("expected total 2, got %d", total)
	}
}
