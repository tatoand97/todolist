package presentation

import (
	"fmt"
	"net/http"
	"strconv"
	"strings"
	"time"
	"todolist/internal/application/useCase"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func NewRouter(router *gin.Engine, authService *useCase.AuthService, categoryService *useCase.CategoryService, taskService *useCase.TaskService, secret string) {
	authHandlers := NewAuthHandlers(authService)
	categoryHandlers := NewCategoryHandlers(categoryService)
	taskHandlers := NewTaskHandlers(taskService)

	router.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	router.POST("/usuarios", authHandlers.Register)
	router.POST("/usuarios/iniciar-sesion", authHandlers.Login)

	authGroup := router.Group("/")
	authGroup.Use(jwtMiddleware(secret))
	authGroup.POST("/usuarios/cerrar-sesion", authHandlers.Logout)

	authGroup.GET("/categorias", categoryHandlers.List)
	authGroup.POST("/categorias", categoryHandlers.Create)
	authGroup.GET("/categorias/:id", categoryHandlers.Get)
	authGroup.PUT("/categorias/:id", categoryHandlers.Update)
	authGroup.DELETE("/categorias/:id", categoryHandlers.Delete)

	authGroup.POST("/tareas", taskHandlers.Create)
	authGroup.GET("/tareas/usuario", taskHandlers.List)
	authGroup.GET("/tareas/:id", taskHandlers.Get)
	authGroup.PUT("/tareas/:id", taskHandlers.Update)
	authGroup.DELETE("/tareas/:id", taskHandlers.Delete)
}

func jwtMiddleware(secret string) gin.HandlerFunc {
	return func(c *gin.Context) {
		auth := c.GetHeader("Authorization")
		parts := strings.Fields(auth)
		if len(parts) != 2 || !strings.EqualFold(parts[0], "Bearer") {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token requerido"})
			return
		}
		tokenStr := parts[1]

		claims := &jwt.RegisteredClaims{}
		token, err := jwt.ParseWithClaims(tokenStr, claims, func(t *jwt.Token) (interface{}, error) {
			if t.Method != jwt.SigningMethodHS256 {
				return nil, fmt.Errorf("algoritmo inválido")
			}
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token inválido"})
			return
		}

		now := time.Now()
		// Verifica expiración
		if claims.ExpiresAt != nil && now.After(claims.ExpiresAt.Time) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token expirado"})
			return
		}
		// Verifica not-before
		if claims.NotBefore != nil && now.Before(claims.NotBefore.Time) {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "token aún no válido"})
			return
		}

		// Extraer userID desde Subject
		if claims.Subject == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "sub faltante"})
			return
		}
		uid64, err := strconv.ParseUint(claims.Subject, 10, 64)
		if err != nil || uid64 == 0 {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "sub inválido"})
			return
		}
		c.Set("userID", uint(uid64))

		c.Next()
	}
}
