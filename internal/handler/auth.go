package handler

import (
    "net/http"
    "strings"

    "github.com/gin-gonic/gin"

    "todolist/internal/service"
)

type AuthHandlers struct {
    svc *service.AuthService
}

func NewAuthHandlers(svc *service.AuthService) *AuthHandlers {
    return &AuthHandlers{svc: svc}
}

type registerRequest struct {
    Username        string  `json:"username" binding:"required"`
    Password        string  `json:"password" binding:"required"`
    ProfileImageURL *string `json:"profileImageUrl"`
}

func (h *AuthHandlers) Register(c *gin.Context) {
    var req registerRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    user, err := h.svc.Register(c.Request.Context(), req.Username, req.Password, req.ProfileImageURL)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusCreated, gin.H{
        "id":             user.ID,
        "username":       user.Username,
        "profileImageUrl": user.ProfileImageURL,
        "avatarUrl":      user.AvatarURL,
    })
}

type loginRequest struct {
    Username string `json:"username" binding:"required"`
    Password string `json:"password" binding:"required"`
}

func (h *AuthHandlers) Login(c *gin.Context) {
    var req loginRequest
    if err := c.ShouldBindJSON(&req); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    token, err := h.svc.Login(c.Request.Context(), req.Username, req.Password)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
        return
    }
    c.JSON(http.StatusOK, gin.H{"token": token})
}

func (h *AuthHandlers) Logout(c *gin.Context) {
    header := c.GetHeader("Authorization")
    token := strings.TrimPrefix(header, "Bearer ")
    _ = h.svc.Logout(c.Request.Context(), token)
    c.Status(http.StatusNoContent)
}
