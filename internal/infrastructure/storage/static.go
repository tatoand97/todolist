package storage

import (
	"context"
	"errors"
	"os"
	"path/filepath"
	"strings"

	"todolist/internal/domain/interfaces"
)

// staticFileWriter writes files to a base directory.
type staticFileWriter struct {
	basePath string
}

// NewStaticFileWriter creates a new file writer for static files.
func NewStaticFileWriter(basePath string) interfaces.FileWriter {
	return &staticFileWriter{basePath: basePath}
}

func (w *staticFileWriter) Write(ctx context.Context, name string, data []byte) error {
	// sanitize name and prevent path traversal
	safeName := filepath.Clean(name)
	if filepath.IsAbs(safeName) || strings.HasPrefix(safeName, "..") {
		return errors.New("invalid filename")
	}

	path := filepath.Join(w.basePath, safeName)

	// ensure directory exists
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}

	return os.WriteFile(path, data, 0644)
}
