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
	dsn := os.Getenv("DATABASE_URL")
	if dsn == "" {
		dsn = "postgres://postgres:postgres@localhost:5432/todolist?sslmode=disable"
	}

	m, err := migrate.New("file://migrations", dsn)
	if err != nil {
		log.Fatalf("migrate init failed: %v", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("migrate up failed: %v", err)
	}

	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("database connection failed: %v", err)
	}

	jwtSecret := os.Getenv("JWT_SECRET")
	if jwtSecret == "" {
		jwtSecret = "secret"
	}

	// Initialize repositories
	userRepo := postgres_repo.NewUserRepository(db)
	categoryRepo := postgres_repo.NewCategoryRepository(db)
	taskRepo := postgres_repo.NewTaskRepository(db)

	// Initialize services
	authService := application.NewAuthService(userRepo, jwtSecret)
	categoryService := application.NewCategoryService(categoryRepo)
	taskService := application.NewTaskService(taskRepo)

	// Setup Gin router
	r := gin.Default()

	presentation.NewRouter(r, authService, categoryService, taskService, jwtSecret)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	if err := r.Run(":" + port); err != nil {
		log.Fatalf("server failed: %v", err)
	}
}
