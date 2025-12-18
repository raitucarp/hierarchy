package application

import (
	"github.com/wailsapp/wails/v2/pkg/runtime"
)

type ViewMode string

const (
	VListViewMode ViewMode = "VListViewMode"
	HListViewMode ViewMode = "HListViewMode"
	TreeViewMode  ViewMode = "TreeViewMode"
	ChartViewMode ViewMode = "ChartViewMode"
	CardViewMode  ViewMode = "CardViewMode"
	GraphViewMode ViewMode = "GraphViewMode"
)

var ViewModes = []struct {
	Value  ViewMode
	TSName string
}{
	{VListViewMode, string(VListViewMode)},
	{HListViewMode, string(HListViewMode)},
	{TreeViewMode, string(TreeViewMode)},
	{ChartViewMode, string(ChartViewMode)},
	{CardViewMode, string(CardViewMode)},
	{GraphViewMode, string(GraphViewMode)},
}

func (hierachyApp *App) ChangeViewMode(filePath string, mode ViewMode) (err error) {
	selectedFileIndex, err := hierachyApp.findSelectedFileIndex(filePath)

	if err != nil {
		return
	}

	hierachyApp.openedFiles.Files[selectedFileIndex].ViewMode = mode
	runtime.EventsEmit(hierachyApp.ctx, string(ChangeViewMode), mode)
	return
}
