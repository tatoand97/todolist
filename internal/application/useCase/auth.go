package useCase

import (
	"context"
	"errors"
	"fmt"
	"mime"
	"net/http"
	"strconv"
	"strings"
	"sync"
	"time"
	"todolist/internal/domain/entities"
	"todolist/internal/domain/interfaces"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

var defaultAvatar = "/static/default.jpg"

type AuthService struct {
	repo          interfaces.UserRepository
	fileWriter    interfaces.FileWriter
	jwtSecret     string
	invalidTokens sync.Map // map[string]struct{}
}

func NewAuthService(repo interfaces.UserRepository, writer interfaces.FileWriter, secret string) *AuthService {
	return &AuthService{repo: repo, fileWriter: writer, jwtSecret: secret}
}

func (s *AuthService) Register(ctx context.Context, username, password string, profileImage []byte) (*entities.User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	imagePath := defaultAvatar

	if len(profileImage) > 0 {
		const maxSize = 5 * 1024 * 1024
		if len(profileImage) > maxSize {
			return nil, errors.New("image too large")
		}
		mimeType := http.DetectContentType(profileImage)
		if !strings.HasPrefix(mimeType, "image/") {
			return nil, errors.New("invalid image type")
		}
		var ext string
		if exts, _ := mime.ExtensionsByType(mimeType); len(exts) > 0 {
			ext = exts[0]
		} else {
			switch mimeType {
			case "image/jpeg":
				ext = ".jpg"
			case "image/png":
				ext = ".png"
			default:
				return nil, errors.New("unsupported image type")
			}
		}
		name := fmt.Sprintf("%d%s", time.Now().UnixNano(), ext)
		if err := s.fileWriter.Write(ctx, name, profileImage); err != nil {
			return nil, err
		}
		imagePath = "/static/" + name
	}

	user := &entities.User{
		Username:        username,
		PasswordHash:    string(hash),
		ProfileImageURL: &imagePath,
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
