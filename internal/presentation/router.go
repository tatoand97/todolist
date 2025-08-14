package presentation

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"

	"todolist/internal/application"
)

func NewRouter(router *gin.Engine, authService *application.AuthService, categoryService *application.CategoryService, taskService *application.TaskService, jwtSecret string) {
	authHandlers := NewAuthHandlers(authService)
	categoryHandlers := NewCategoryHandlers(categoryService)
	taskHandlers := NewTaskHandlers(taskService)

	router.POST("/usuarios", authHandlers.Register)
	router.POST("/usuarios/iniciar-sesion", authHandlers.Login)

	authGroup := router.Group("/")
	authGroup.Use(jwtMiddleware(jwtSecret))
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

func jwtMiddleware(jwtSecret string) gin.HandlerFunc {
	return func(context *gin.Context) {
		header := context.GetHeader("Authorization")
		if header == "" || !strings.HasPrefix(header, "Bearer ") {
			context.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		tokenString := strings.TrimPrefix(header, "Bearer ")
		token, err := jwt.Parse(tokenString, func(parsedToken *jwt.Token) (interface{}, error) {
			if _, ok := parsedToken.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(jwtSecret), nil
		})
		if err != nil || !token.Valid {
			context.AbortWithStatus(http.StatusUnauthorized)
			return
		}
		if claims, ok := token.Claims.(jwt.MapClaims); ok {
			if sub, ok := claims["sub"].(float64); ok {
				context.Set("userID", uint(sub))
			}
		}
		context.Next()
	}
}
