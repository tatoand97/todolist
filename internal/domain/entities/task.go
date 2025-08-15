package entities

import "time"

type Task struct {
	ID         uint      `gorm:"primaryKey"`
	Text       string    `gorm:"not null"`
	CreatedAt  time.Time `gorm:"autoCreateTime"`
	DueDate    *time.Time
	State      string `gorm:"not null"`
	CategoryID uint   `gorm:"not null"`
	UserID     uint   `gorm:"not null"`
}
