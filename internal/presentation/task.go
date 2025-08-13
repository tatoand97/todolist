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
	svc *application.TaskService
}

func NewTaskHandlers(svc *application.TaskService) *TaskHandlers {
	return &TaskHandlers{svc: svc}
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
	task := &domain.Task{Text: req.Text, DueDate: req.DueDate, CategoryID: req.CategoryID, UserID: getUserID(c)}
	if err := h.svc.Create(c.Request.Context(), task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusCreated, task)
}

func (h *TaskHandlers) List(c *gin.Context) {
	var filter domain.TaskFilter
	if v := c.Query("categoriaId"); v != "" {
		if id, err := strconv.Atoi(v); err == nil {
			uid := uint(id)
			filter.CategoryID = &uid
		}
	}
	if v := c.Query("estado"); v != "" {
		filter.State = &v
	}
	tasks, err := h.svc.List(c.Request.Context(), getUserID(c), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, tasks)
}

func (h *TaskHandlers) Get(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	task, err := h.svc.Get(c.Request.Context(), uint(id), getUserID(c))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

func (h *TaskHandlers) Update(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
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
	task := &domain.Task{ID: uint(id), UserID: getUserID(c)}
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
	if err := h.svc.Update(c.Request.Context(), task); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, task)
}

func (h *TaskHandlers) Delete(c *gin.Context) {
	id, _ := strconv.Atoi(c.Param("id"))
	if err := h.svc.Delete(c.Request.Context(), uint(id), getUserID(c)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
