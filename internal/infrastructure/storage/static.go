package storage

import (
	"context"
	"os"
	"path/filepath"

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
	path := filepath.Join(w.basePath, name)
	return os.WriteFile(path, data, 0644)
}
