package entities

type Category struct {
	ID          uint   `gorm:"primaryKey"`
	Name        string `gorm:"not null"`
	Description string
	UserID      uint `gorm:"not null"`
}
