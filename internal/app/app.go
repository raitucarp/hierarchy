package application

import (
	"context"
	"os"
	"path/filepath"
	"strings"

	listmd "github.com/raitucarp/list.md"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

// App struct
type App struct {
	ctx context.Context
}

// New creates a new App application struct
func New() *App {
	return &App{}
}

// startup is called when the app starts. The context is saved
// so we can call the runtime methods
func (hierachyApp *App) Startup(ctx context.Context) {
	hierachyApp.ctx = ctx
}

type Metadata struct {
	Name     string `yml:"name,omitempty" json:"name"`
	Layout   string `yml:"layout" json:"layout"`
	FilePath string `json:"file_path"`
}

// Greet returns a greeting for the given name
func (hierachyApp *App) OpenListMdFile() (lists listmd.ListMd, err error) {
	listMdFilePath, err := runtime.OpenFileDialog(hierachyApp.ctx, runtime.OpenDialogOptions{
		Title: "Select File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "List Markdown (*.list.md)",
				Pattern:     "*.list.md",
			},
		},
	})

	listMdContent, err := os.ReadFile(listMdFilePath)

	var metadata Metadata
	lists, err = listmd.Unmarshal(listMdContent, &metadata)
	if err != nil {
		return
	}

	metadata.FilePath = listMdFilePath
	if metadata.Name == "" {
		metadata.Name = strings.ReplaceAll(filepath.Base(listMdFilePath), ".list.md", "")
		lists.Metadata = metadata
	}

	return
}
