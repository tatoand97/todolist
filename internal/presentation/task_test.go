package presentation

import (
	"context"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/gin-gonic/gin"

	"todolist/internal/application/useCase"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"
)

type mockTaskRepo struct {
	updatedTask *entities.Task
}

func (m *mockTaskRepo) Create(ctx context.Context, task *entities.Task) error { return nil }
func (m *mockTaskRepo) Update(ctx context.Context, task *entities.Task) error {
	m.updatedTask = task
	return nil
}
func (m *mockTaskRepo) Delete(ctx context.Context, id uint, userID uint) error { return nil }
func (m *mockTaskRepo) Get(ctx context.Context, id uint, userID uint) (*entities.Task, error) {
	return nil, nil
}
func (m *mockTaskRepo) List(ctx context.Context, userID uint, filter interfaces.TaskFilter) ([]entities.Task, int64, error) {
	return nil, 0, nil
}

func TestTaskHandlersUpdateAcceptsStringCategoryID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &mockTaskRepo{}
	handler := NewTaskHandlers(useCase.NewTaskService(repo))

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodPut, "/tasks/1", strings.NewReader(`{"idCategoria": "123"}`))
	c.Request.Header.Set("Content-Type", "application/json")
	c.Params = gin.Params{{Key: "id", Value: "1"}}
	c.Set("userID", uint(1))

	handler.Update(c)

	if w.Code != http.StatusOK {
		t.Fatalf("expected status 200, got %d", w.Code)
	}
	if repo.updatedTask == nil || repo.updatedTask.CategoryID != 123 {
		t.Fatalf("expected CategoryID 123, got %+v", repo.updatedTask)
	}
}

func TestTaskHandlersUpdateRejectsNonNumericCategoryID(t *testing.T) {
	gin.SetMode(gin.TestMode)
	repo := &mockTaskRepo{}
	handler := NewTaskHandlers(useCase.NewTaskService(repo))

	w := httptest.NewRecorder()
	c, _ := gin.CreateTestContext(w)
	c.Request = httptest.NewRequest(http.MethodPut, "/tasks/1", strings.NewReader(`{"idCategoria": "abc"}`))
	c.Request.Header.Set("Content-Type", "application/json")
	c.Params = gin.Params{{Key: "id", Value: "1"}}
	c.Set("userID", uint(1))

	handler.Update(c)

	if w.Code != http.StatusBadRequest {
		t.Fatalf("expected status 400, got %d", w.Code)
	}
}
