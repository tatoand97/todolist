package presentation

import (
	"net/http"
	"strconv"
	"strings"
	"todolist/internal/application"
	"todolist/internal/application/useCase"
	"todolist/internal/domain/entities"

	"github.com/gin-gonic/gin"
)

type CategoryHandlers struct {
	categoryService *useCase.CategoryService
}

func NewCategoryHandlers(categoryService *useCase.CategoryService) *CategoryHandlers {
	return &CategoryHandlers{categoryService: categoryService}
}

func (h *CategoryHandlers) Create(c *gin.Context) {
	ctx, cancel := application.CtxTO(c.Request.Context())
	defer cancel()

	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "usuario no autenticado"})
		return
	}

	var req struct {
		Name        string `json:"nombre" binding:"required"`
		Description string `json:"descripcion"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	category := &entities.Category{
		Name:        strings.TrimSpace(req.Name),
		Description: req.Description,
		UserId:      userID.(uint),
	}

	if err := h.categoryService.Create(ctx, category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.Header("Location", "/categorias/"+strconv.FormatUint(uint64(category.ID), 10))
	c.JSON(http.StatusCreated, category)
}

func (h *CategoryHandlers) List(c *gin.Context) {
	categories, err := h.categoryService.List(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, categories)
}

func (h *CategoryHandlers) Get(c *gin.Context) {
	categoryID, _ := strconv.Atoi(c.Param("id"))
	category, err := h.categoryService.Get(c.Request.Context(), uint(categoryID))
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandlers) Update(c *gin.Context) {
	categoryID, _ := strconv.Atoi(c.Param("id"))
	var req struct {
		Name        string `json:"nombre"`
		Description string `json:"descripcion"`
	}
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	category := &entities.Category{ID: uint(categoryID), Name: req.Name, Description: req.Description}
	if err := h.categoryService.Update(c.Request.Context(), category); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusOK, category)
}

func (h *CategoryHandlers) Delete(c *gin.Context) {
	categoryID, _ := strconv.Atoi(c.Param("id"))
	if err := h.categoryService.Delete(c.Request.Context(), uint(categoryID)); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.Status(http.StatusNoContent)
}
