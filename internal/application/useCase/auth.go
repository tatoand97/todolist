package useCase

import (
	"context"
	"errors"
	"strconv"
	"sync"
	"time"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

const defaultAvatar = "/static/default.jpg"

type AuthService struct {
	repo          interfaces.UserRepository
	jwtSecret     string
	invalidTokens sync.Map // map[string]struct{}
}

func NewAuthService(repo interfaces.UserRepository, secret string) *AuthService {
	return &AuthService{repo: repo, jwtSecret: secret}
}

func (s *AuthService) Register(ctx context.Context, username, password string, profileImageURL *string) (*entities.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	if profileImageURL == nil {
		profileImageURL = &defaultAvatar
	}
	user := &entities.User{
		Username:        username,
		PasswordHash:    string(hash),
		ProfileImageURL: profileImageURL,
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

	now := time.Now()
	claims := jwt.RegisteredClaims{
		Subject:   strconv.FormatUint(uint64(user.ID), 10),
		ExpiresAt: jwt.NewNumericDate(now.Add(24 * time.Hour)),
		IssuedAt:  jwt.NewNumericDate(now),
		NotBefore: jwt.NewNumericDate(now),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(s.jwtSecret))
}

func (s *AuthService) Logout(ctx context.Context, token string) error {
	if token == "" {
		return errors.New("empty token")
	}
	s.invalidTokens.Store(token, struct{}{})
	return nil
}
