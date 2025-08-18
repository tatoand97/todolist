package entities

import "time"

type Task struct {
	ID         uint       `gorm:"primaryKey" json:"id"`
	Text       string     `gorm:"not null" json:"texto"`
	CreatedAt  time.Time  `gorm:"autoCreateTime" json:"fechaCreacion"`
	DueDate    *time.Time `json:"fechaTentativaFin"`
	State      string     `gorm:"not null" json:"estado"`
	CategoryID uint       `gorm:"not null" json:"categoriaId"`
	UserID     uint       `gorm:"not null" json:"usuarioId"`
}
