package application

import (
	"context"
	"os"
	"path/filepath"
	"strings"

	listmd "github.com/raitucarp/list.md"
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ListFile struct {
	Lists                [][]*listmd.Node `json:"lists"`
	Metadata             Metadata         `json:"metadata"`
	ViewMode             ViewMode         `json:"viewMode"`
	SelectedListItems    []string         `json:"selectedListItems"`
	PreSelectedListItems []string         `json:"preSelectedListItems"`
}

type OpenedFiles struct {
	SelectedFile string     `json:"selected"`
	Files        []ListFile `json:"files"`
}

// App struct
type App struct {
	ctx         context.Context
	openedFiles *OpenedFiles
}

// New creates a new App application struct
func New() *App {
	return &App{
		openedFiles: &OpenedFiles{SelectedFile: "", Files: []ListFile{}},
	}
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
func (hierachyApp *App) OpenListMdFile() (err error) {
	listMdFilePath, err := runtime.OpenFileDialog(hierachyApp.ctx, runtime.OpenDialogOptions{
		Title: "Select File",
		Filters: []runtime.FileFilter{
			{
				DisplayName: "List Markdown (*.list.md)",
				Pattern:     "*.list.md",
			},
		},
	})

	if err != nil {
		return
	}

	listMdContent, err := os.ReadFile(listMdFilePath)
	if err != nil {
		return
	}

	var metadata Metadata
	listMd, err := listmd.Unmarshal(listMdContent, &metadata)
	if err != nil {
		return
	}

	metadata.FilePath = listMdFilePath
	if metadata.Name == "" {
		metadata.Name = strings.ReplaceAll(filepath.Base(listMdFilePath), ".list.md", "")
		listMd.Metadata = metadata
	}

	hierachyApp.openedFiles.Files = append(hierachyApp.openedFiles.Files, ListFile{
		Lists:    listMd.Lists,
		Metadata: metadata,
		ViewMode: VListViewMode,
	})
	hierachyApp.openedFiles.SelectedFile = listMdFilePath

	runtime.EventsEmit(hierachyApp.ctx, string(ReloadAllOpenedFiles), "")
	return
}
