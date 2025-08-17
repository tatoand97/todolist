package interfaces

import "context"

// FileWriter defines file writing behavior.
type FileWriter interface {
	Write(ctx context.Context, name string, data []byte) error
}
