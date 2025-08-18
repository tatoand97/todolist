package presentation

import (
	"net/http"
	"strconv"
	"time"
	"todolist/internal/application/useCase"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"

	"github.com/gin-gonic/gin"
)

type TaskHandlers struct {
	taskService *useCase.TaskService
}

func NewTaskHandlers(taskService *useCase.TaskService) *TaskHandlers {
	return &TaskHandlers{taskService: taskService}
}

func getUserID(c *gin.Context) uint {
	v, _ := c.Get("userID")
	if id, ok := v.(uint); ok {
		return id
	}
	return 0
}

func (h *TaskHandlers) Create(c *gin.Context) {
	var req struct {
		Text       string     `json:"texto" binding:"required"`
		DueDate    *time.Time `json:"fechaTentativaFin"`
		CategoryID uint       `json:"idCategoria" binding:"required"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := &entities.Task{Text: req.Text, DueDate: req.DueDate, CategoryID: req.CategoryID, UserID: getUserID(c)}
	if err := h.taskService.Create(c.Request.Context(), task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandlers) List(c *gin.Context) {
	var filter interfaces.TaskFilter
	if categoryIDParam := c.Query("categoriaId"); categoryIDParam != "" {
		if categoryID, err := strconv.Atoi(categoryIDParam); err == nil {
			categoryIDUint := uint(categoryID)
			filter.CategoryID = &categoryIDUint
		}
	}
	if stateParam := c.Query("estado"); stateParam != "" {
		filter.State = &stateParam
	}
	var taskList, err = h.taskService.List(c.Request.Context(), getUserID(c), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, taskList)
}

func (h *TaskHandlers) Get(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("id"))
	task, err := h.taskService.Get(c.Request.Context(), uint(taskID), getUserID(c))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

func (h *TaskHandlers) Update(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("id"))
	var req struct {
		Text       *string    `json:"texto"`
		DueDate    *time.Time `json:"fechaTentativaFin"`
		State      *string    `json:"estado"`
		CategoryID *uint      `json:"idCategoria"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	task := &entities.Task{ID: uint(taskID), UserID: getUserID(c)}
	if req.Text != nil {
		task.Text = *req.Text
	}
	if req.DueDate != nil {
		task.DueDate = req.DueDate
	}
	if req.State != nil {
		task.State = *req.State
	}
	if req.CategoryID != nil {
		task.CategoryID = *req.CategoryID
	}
	if err := h.taskService.Update(c.Request.Context(), task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

func (h *TaskHandlers) Delete(c *gin.Context) {
	taskID, _ := strconv.Atoi(c.Param("id"))
	if err := h.taskService.Delete(c.Request.Context(), uint(taskID), getUserID(c)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
