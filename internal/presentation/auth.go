package presentation

import (
	"net/http"
	"strings"
	"todolist/internal/application/useCase"

	"github.com/gin-gonic/gin"
)

type AuthHandlers struct {
	service *useCase.AuthService
}

func NewAuthHandlers(service *useCase.AuthService) *AuthHandlers {
	return &AuthHandlers{service: service}
}

type registerRequest struct {
	Username        string  `json:"username" binding:"required"`
	Password        string  `json:"password" binding:"required"`
	ProfileImageURL *string `json:"profileImageUrl"`
}

func (handler *AuthHandlers) Register(context *gin.Context) {
	var request registerRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	user, err := handler.service.Register(context.Request.Context(), request.Username, request.Password, request.ProfileImageURL)
	if err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusCreated, gin.H{
		"id":              user.ID,
		"username":        user.Username,
		"profileImageUrl": user.ProfileImageURL,
		"avatarUrl":       user.AvatarURL,
	})
}

type loginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

func (handler *AuthHandlers) Login(context *gin.Context) {
	var request loginRequest
	if err := context.ShouldBindJSON(&request); err != nil {
		context.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	token, err := handler.service.Login(context.Request.Context(), request.Username, request.Password)
	if err != nil {
		context.JSON(http.StatusUnauthorized, gin.H{"error": err.Error()})
		return
	}
	context.JSON(http.StatusOK, gin.H{"token": token})
}

func (handler *AuthHandlers) Logout(context *gin.Context) {
	header := context.GetHeader("Authorization")
	const prefix = "Bearer "
	if header == "" || !strings.HasPrefix(header, prefix) {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "invalid authorization header"})
		return
	}
	token := strings.TrimSpace(header[len(prefix):])
	if token == "" {
		context.JSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
		return
	}
	if err := handler.service.Logout(context.Request.Context(), token); err != nil {
		context.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}
	context.Status(http.StatusNoContent)
}
