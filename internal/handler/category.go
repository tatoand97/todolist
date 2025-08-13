package handler

import (
    "net/http"
    "strconv"

    "github.com/gin-gonic/gin"

    "todolist/internal/domain"
    "todolist/internal/service"
)

type CategoryHandlers struct {
    svc *service.CategoryService
}

func NewCategoryHandlers(svc *service.CategoryService) *CategoryHandlers {
    return &CategoryHandlers{svc: svc}
}

func getUserID(c *gin.Context) uint {
    v, _ := c.Get("userID")
    if id, ok := v.(uint); ok {
        return id
    }
    return 0
}

func (h *CategoryHandlers) Create(c *gin.Context) {
    var req struct {
        Name        string `json:"nombre" binding:"required"`
        Description string `json:"descripcion"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    cat := &domain.Category{Name: req.Name, Description: req.Description, UserID: getUserID(c)}
    if err := h.svc.Create(c.Request.Context(), cat); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, cat)
}

func (h *CategoryHandlers) List(c *gin.Context) {
    cats, err := h.svc.List(c.Request.Context(), getUserID(c))
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, cats)
}

func (h *CategoryHandlers) Get(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    cat, err := h.svc.Get(c.Request.Context(), uint(id), getUserID(c))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, cat)
}

func (h *CategoryHandlers) Update(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    var req struct {
        Name        string `json:"nombre"`
        Description string `json:"descripcion"`
    }
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    cat := &domain.Category{ID: uint(id), Name: req.Name, Description: req.Description, UserID: getUserID(c)}
    if err := h.svc.Update(c.Request.Context(), cat); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, cat)
}

func (h *CategoryHandlers) Delete(c *gin.Context) {
    id, _ := strconv.Atoi(c.Param("id"))
    if err := h.svc.Delete(c.Request.Context(), uint(id), getUserID(c)); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.Status(http.StatusNoContent)
}
