package validations

import (
	"errors"
	"strings"
	"todolist/internal/domain"
	"todolist/internal/domain/entities"
)

func ValidateNewCategory(c *entities.Category) error {
	if c == nil {
		return domain.ErrInvalid
	}
	sanitizeCategory(c)
	if c.Name == "" {
		return errors.Join(domain.ErrInvalid, errors.New("name requerido"))
	}
	if len(c.Name) > 100 {
		return errors.Join(domain.ErrInvalid, errors.New("name demasiado largo"))
	}
	return nil
}

func ValidateUpdate(c *entities.Category) error {
	if c == nil || c.ID == 0 {
		return domain.ErrInvalid
	}
	sanitizeCategory(c)
	if c.Name == "" {
		return errors.Join(domain.ErrInvalid, errors.New("name requerido"))
	}
	if len(c.Name) > 100 {
		return errors.Join(domain.ErrInvalid, errors.New("name demasiado largo"))
	}
	return nil
}

func sanitizeCategory(c *entities.Category) {
	c.Name = strings.TrimSpace(c.Name)
}
