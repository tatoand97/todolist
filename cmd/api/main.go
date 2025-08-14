package main

import (
	"log"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"

	"todolist/internal/application"
	postgres_repo "todolist/internal/infrastructure/postgres"
	"todolist/internal/presentation"
)

func main() {
	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		databaseURL = "postgres://postgres:postgres@localhost:5432/todolist?sslmode=disable"
	}

	migration, err := migrate.New("file://migrations", databaseURL)
	if err != nil {
		log.Fatalf("migrate init failed: %v", err)
	}
	if err := migration.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("migrate up failed: %v", err)
	}

	database, err := gorm.Open(postgres.Open(databaseURL), &gorm.Config{})
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	jwtSecretKey := os.Getenv("JWT_SECRET")
	if jwtSecretKey == "" {
		jwtSecretKey = "secret"
	}

	// Initialize repositories
	userRepository := postgres_repo.NewUserRepository(database)
	categoryRepository := postgres_repo.NewCategoryRepository(database)
	taskRepository := postgres_repo.NewTaskRepository(database)

	// Initialize services
	authService := application.NewAuthService(userRepository, jwtSecretKey)
	categoryService := application.NewCategoryService(categoryRepository)
	taskService := application.NewTaskService(taskRepository)

	// Setup Gin router
	router := gin.Default()

	presentation.NewRouter(router, authService, categoryService, taskService, jwtSecretKey)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := router.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
