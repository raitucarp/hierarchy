package application

type Event string

const (
	ReloadAllOpenedFiles Event = "ReloadAllOpenedFiles"
	ReloadSelectedItems  Event = "ReloadSelectedItems"
	ChangeViewMode       Event = "ChangeViewMode"
)

var AllEvents = []struct {
	Value  Event
	TSName string
}{
	{ReloadAllOpenedFiles, string(ReloadAllOpenedFiles)},
	{ReloadSelectedItems, string(ReloadSelectedItems)},
	{ChangeViewMode, string(ChangeViewMode)},
}
