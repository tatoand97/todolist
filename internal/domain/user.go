package domain

type User struct {
    ID             uint   `gorm:"primaryKey"`
    Username       string `gorm:"uniqueIndex;not null"`
    PasswordHash   string `gorm:"not null"`
    ProfileImageURL *string
    AvatarURL      string `gorm:"not null"`
}
