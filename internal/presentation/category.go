package presentation

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"

	"todolist/internal/application"
	"todolist/internal/domain"
)

type CategoryHandlers struct {
	service *application.CategoryService
}

func NewCategoryHandlers(service *application.CategoryService) *CategoryHandlers {
	return &CategoryHandlers{service: service}
}

func getUserID(context *gin.Context) uint {
	userIDValue, _ := context.Get("userID")
	if userID, ok := userIDValue.(uint); ok {
		return userID
	}
	return 0
}

func (handler *CategoryHandlers) Create(context *gin.Context) {
	var request struct {
		Name        string `json:"nombre" binding:"required"`
		Description string `json:"descripcion"`
	}
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	category := &domain.Category{Name: request.Name, Description: request.Description, UserID: getUserID(context)}
	if err := handler.service.Create(context.Request.Context(), category); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusCreated, category)
}

func (handler *CategoryHandlers) List(context *gin.Context) {
	categories, err := handler.service.List(context.Request.Context(), getUserID(context))
	if err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, categories)
}

func (handler *CategoryHandlers) Get(context *gin.Context) {
	categoryID, _ := strconv.Atoi(context.Param("id"))
	category, err := handler.service.Get(context.Request.Context(), uint(categoryID), getUserID(context))
	if err != nil {
		context.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, category)
}

func (handler *CategoryHandlers) Update(context *gin.Context) {
	categoryID, _ := strconv.Atoi(context.Param("id"))
	var request struct {
		Name        string `json:"nombre"`
		Description string `json:"descripcion"`
	}
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	category := &domain.Category{ID: uint(categoryID), Name: request.Name, Description: request.Description, UserID: getUserID(context)}
	if err := handler.service.Update(context.Request.Context(), category); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, category)
}

func (handler *CategoryHandlers) Delete(context *gin.Context) {
	categoryID, _ := strconv.Atoi(context.Param("id"))
	if err := handler.service.Delete(context.Request.Context(), uint(categoryID), getUserID(context)); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.Status(http.StatusNoContent)
}
