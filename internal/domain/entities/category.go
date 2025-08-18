package entities

type Category struct {
	ID          uint   `gorm:"primaryKey" json:"id"`
	Name        string `gorm:"not null" json:"nombre"`
	Description string `json:"descripcion"`
	UserId      uint   `gorm:"not null" json:"user_id"`
}
