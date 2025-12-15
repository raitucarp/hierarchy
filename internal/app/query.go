package application

type QueryKey string

const (
	OpenedFilesKey       QueryKey = "OpenedFilesKey"
	ViewModeKey          QueryKey = "ViewModeKey"
	ListSelectedItemsKey QueryKey = "ListSelectedItemsKey"
)

var AllQueryKeys = []struct {
	Value  QueryKey
	TSName string
}{
	{OpenedFilesKey, string(OpenedFilesKey)},
	{ViewModeKey, string(ViewModeKey)},
	{ListSelectedItemsKey, string(ListSelectedItemsKey)},
}
