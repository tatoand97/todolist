package main

import (
    "log"
    "os"

    "github.com/gin-gonic/gin"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"

    "todolist/internal/handler"
    "todolist/internal/domain"
    postgres_repo "todolist/internal/repository/postgres"
    "todolist/internal/service"
)

func main() {
    dsn := os.Getenv("DATABASE_URL")
    if dsn == "" {
        dsn = "postgres://postgres:postgres@localhost:5432/todolist?sslmode=disable"
    }
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        log.Fatalf("database connection failed: %v", err)
    }
    if err := db.AutoMigrate(&domain.User{}, &domain.Category{}, &domain.Task{}); err != nil {
        log.Fatalf("auto migrate failed: %v", err)
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
    authService := service.NewAuthService(userRepo, jwtSecret)
    categoryService := service.NewCategoryService(categoryRepo)
    taskService := service.NewTaskService(taskRepo)

    // Setup Gin router
    r := gin.Default()

    handler.NewRouter(r, authService, categoryService, taskService, jwtSecret)

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    if err := r.Run(":" + port); err != nil {
        log.Fatalf("server failed: %v", err)
    }
}

