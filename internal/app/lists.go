package application

import (
	"errors"
	"slices"
	"strconv"
	"strings"

	"github.com/wailsapp/wails/v2/pkg/runtime"
)

func (hierachyApp *App) AllOpenedFiles() *OpenedFiles {
	return hierachyApp.openedFiles
}

func (hierachyApp *App) findSelectedFileIndex(filePath string) (fileIndex int, err error) {
	selectedFileIndex := -1
	for fileIndex, file := range hierachyApp.openedFiles.Files {
		if file.Metadata.FilePath == filePath {
			selectedFileIndex = fileIndex
		}
	}

	if selectedFileIndex == -1 {
		return selectedFileIndex, errors.New("Selected file not found")
	}

	return selectedFileIndex, err
}

func (hierachyApp *App) ChangeSelectedFile(filePath string) (err error) {
	_, err = hierachyApp.findSelectedFileIndex(filePath)
	if err != nil {
		return
	}

	hierachyApp.openedFiles.SelectedFile = filePath
	runtime.EventsEmit(hierachyApp.ctx, string(ReloadAllOpenedFiles), filePath)

	return
}

func (hierachyApp *App) SelectListItem(filePath string, uid string) (err error) {
	selectedFileIndex, err := hierachyApp.findSelectedFileIndex(filePath)

	if err != nil {
		return errors.New("Selected file not found")
	}

	splittedUid := strings.Split(uid, "_")
	collection, err := strconv.Atoi(splittedUid[1])
	if err != nil {
		return
	}

	level := len(splittedUid) - 3
	selectedItems := hierachyApp.openedFiles.Files[selectedFileIndex].SelectedListItems
	newSelectedListItems := []string{}

	selectedItemsByLevelAndCollections := map[int]map[int][]string{}

	for _, selectedUid := range selectedItems {
		splittedUid := strings.Split(selectedUid, "_")
		collection, _ := strconv.Atoi(splittedUid[1])
		level := len(splittedUid) - 3

		if selectedItemsByLevelAndCollections[level] == nil {
			selectedItemsByLevelAndCollections[level] = make(map[int][]string)
		}

		selectedItemsByLevelAndCollections[level][collection] =
			append(selectedItemsByLevelAndCollections[level][collection], selectedUid)
	}

	if slices.Contains(selectedItemsByLevelAndCollections[level][collection], uid) {
		newSelectedListItems = slices.DeleteFunc(selectedItems, func(_uid string) bool { return strings.HasPrefix(_uid, uid) })

	} else {
		newSelectedListItems = selectedItems

		sameCollectionAndLevelFunc := func(_uid string) bool {
			_splittedUid := strings.Split(_uid, "_")
			_collection, _ := strconv.Atoi(_splittedUid[1])
			_level := len(_splittedUid) - 3
			return _collection == collection && _level == level
		}

		sameLevelIndex := slices.IndexFunc(newSelectedListItems, sameCollectionAndLevelFunc)

		if sameLevelIndex != -1 {
			newSelectedListItems = slices.DeleteFunc(newSelectedListItems, func(_uid string) bool { return strings.HasPrefix(_uid, newSelectedListItems[sameLevelIndex]) })
		}

		// newSelectedListItems = slices.DeleteFunc(newSelectedListItems, func(_uid string) bool { return strings.HasPrefix(_uid, uid) })
		newSelectedListItems = slices.DeleteFunc(newSelectedListItems, sameCollectionAndLevelFunc)
		newSelectedListItems = append(newSelectedListItems, uid)
	}

	hierachyApp.openedFiles.Files[selectedFileIndex].SelectedListItems = newSelectedListItems
	runtime.EventsEmit(
		hierachyApp.ctx,
		string(ReloadSelectedItems),
		newSelectedListItems,
	)

	return
}

func (hierachyApp *App) ListSelectedItems(filePath string) (selectedListItems []string, err error) {
	selectedFileIndex, err := hierachyApp.findSelectedFileIndex(filePath)

	if err != nil {
		return
	}

	selectedListItems = hierachyApp.openedFiles.Files[selectedFileIndex].SelectedListItems

	return
}
