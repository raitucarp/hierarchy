package application

type ViewMode string

const (
	VListViewMode ViewMode = "VListViewMode"
	HListViewMode ViewMode = "HListViewMode"
	TreeViewMode  ViewMode = "TreeViewMode"
	ChartViewMode ViewMode = "ChartViewMode"
	CardViewMode  ViewMode = "CardViewMode"
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
}
