package presentation

import (
	"net/http"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"

	"todolist/internal/application"
	"todolist/internal/domain"
)

type TaskHandlers struct {
	service *application.TaskService
}

func NewTaskHandlers(service *application.TaskService) *TaskHandlers {
	return &TaskHandlers{service: service}
}

func (handler *TaskHandlers) Create(context *gin.Context) {
	var request struct {
		Text       string     `json:"texto" binding:"required"`
		DueDate    *time.Time `json:"fechaTentativaFin"`
		CategoryID uint       `json:"idCategoria" binding:"required"`
	}
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := &domain.Task{Text: request.Text, DueDate: request.DueDate, CategoryID: request.CategoryID, UserID: getUserID(context)}
	if err := handler.service.Create(context.Request.Context(), task); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusCreated, task)
}

func (handler *TaskHandlers) List(context *gin.Context) {
	var filter domain.TaskFilter
	if categoryIDParam := context.Query("categoriaId"); categoryIDParam != "" {
		if categoryIDInt, err := strconv.Atoi(categoryIDParam); err == nil {
			categoryIDUint := uint(categoryIDInt)
			filter.CategoryID = &categoryIDUint
		}
	}
	if stateParam := context.Query("estado"); stateParam != "" {
		filter.State = &stateParam
	}
	tasks, err := handler.service.List(context.Request.Context(), getUserID(context), filter)
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, tasks)
}

func (handler *TaskHandlers) Get(context *gin.Context) {
	taskID, _ := strconv.Atoi(context.Param("id"))
	task, err := handler.service.Get(context.Request.Context(), uint(taskID), getUserID(context))
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, task)
}

func (handler *TaskHandlers) Update(context *gin.Context) {
	taskID, _ := strconv.Atoi(context.Param("id"))
	var request struct {
		Text       *string    `json:"texto"`
		DueDate    *time.Time `json:"fechaTentativaFin"`
		State      *string    `json:"estado"`
		CategoryID *uint      `json:"idCategoria"`
	}
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := &domain.Task{ID: uint(taskID), UserID: getUserID(context)}
	if request.Text != nil {
		task.Text = *request.Text
	}
	if request.DueDate != nil {
		task.DueDate = request.DueDate
	}
	if request.State != nil {
		task.State = *request.State
	}
	if request.CategoryID != nil {
		task.CategoryID = *request.CategoryID
	}
	if err := handler.service.Update(context.Request.Context(), task); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, task)
}

func (handler *TaskHandlers) Delete(context *gin.Context) {
	taskID, _ := strconv.Atoi(context.Param("id"))
	if err := handler.service.Delete(context.Request.Context(), uint(taskID), getUserID(context)); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.Status(http.StatusNoContent)
}
