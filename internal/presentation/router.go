package presentation

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"todolist/internal/application"
)

func NewRouter(r *gin.Engine, auth *application.AuthService, category *application.CategoryService, task *application.TaskService, secret string) {
	authHandlers := NewAuthHandlers(auth)
	categoryHandlers := NewCategoryHandlers(category)
	taskHandlers := NewTaskHandlers(task)

	r.POST("/usuarios", authHandlers.Register)
	r.POST("/usuarios/iniciar-sesion", authHandlers.Login)

	authGroup := r.Group("/")
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
		header := c.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		tokenStr := strings.TrimPrefix(header, "Bearer ")
		token, err := jwt.Parse(tokenStr, func(t *jwt.Token) (interface{}, error) {
			if _, ok := t.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(secret), nil
		})
		if err != nil || !token.Valid {
			c.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if sub, ok := claims["sub"].(float64); ok {
				c.Set("userID", uint(sub))
			}
		}
		c.Next()
	}
}
