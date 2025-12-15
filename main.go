package main

import (
	"embed"

	application "github.com/raitucarp/hierarchy/internal/app"
	"github.com/wailsapp/wails/v2"
	"github.com/wailsapp/wails/v2/pkg/options"
	"github.com/wailsapp/wails/v2/pkg/options/assetserver"
	"github.com/wailsapp/wails/v2/pkg/options/windows"
)

//go:embed all:app/dist
var assets embed.FS

func main() {
	// Create an instance of the app structure
	app := application.New()

	// Create application with options
	err := wails.Run(&options.App{
		Title:     "hierarchy",
		Width:     1280,
		Height:    1024,
		MinWidth:  1280,
		MinHeight: 1024,
		Frameless: true,
		Windows: &windows.Options{
			BackdropType: windows.Mica,
		},
		WindowStartState: options.Maximised,
		AssetServer: &assetserver.Options{
			Assets: assets,
		},
		BackgroundColour: &options.RGBA{R: 27, G: 38, B: 54, A: 1},
		OnStartup:        app.Startup,
		Bind: []any{
			app,
		},
		EnumBind: []any{
			application.AllEvents,
			application.AllQueryKeys,
			application.ViewModes,
		},
	})

	if err != nil {
		println("Error:", err.Error())
	}
}
