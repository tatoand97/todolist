package service

import (
    "context"
    "errors"
    "time"

    "github.com/golang-jwt/jwt/v5"
    "golang.org/x/crypto/bcrypt"

    "todolist/internal/domain"
    "todolist/internal/repository"
)

const defaultAvatar = "https://example.com/default-avatar.png"

type AuthService struct {
    repo      repository.UserRepository
    jwtSecret string
}

func NewAuthService(repo repository.UserRepository, secret string) *AuthService {
    return &AuthService{repo: repo, jwtSecret: secret}
}

func (s *AuthService) Register(ctx context.Context, username, password string, profileImageURL *string) (*domain.User, error) {
    hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
    if err != nil {
        return nil, err
    }
    avatar := defaultAvatar
    user := &domain.User{
        Username:       username,
        PasswordHash:   string(hash),
        ProfileImageURL: profileImageURL,
        AvatarURL:      avatar,
    }
    if err := s.repo.Create(ctx, user); err != nil {
        return nil, err
    }
    return user, nil
}

func (s *AuthService) Login(ctx context.Context, username, password string) (string, error) {
    user, err := s.repo.GetByUsername(ctx, username)
    if err != nil {
        return "", err
    }
    if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(password)); err != nil {
        return "", errors.New("invalid credentials")
    }
    token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
        "sub": user.ID,
        "exp": time.Now().Add(24 * time.Hour).Unix(),
    })
    return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) Logout(ctx context.Context, token string) error {
    // token invalidation would go here
    return nil
}
