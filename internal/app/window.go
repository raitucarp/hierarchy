package application

import "github.com/wailsapp/wails/v2/pkg/runtime"

func (hierachyApp *App) ToggleMaximize() {
	runtime.WindowToggleMaximise(hierachyApp.ctx)
	runtime.EventsEmit(hierachyApp.ctx, string(WindowMaximize), runtime.WindowIsMaximised(hierachyApp.ctx))
}

func (hierachyApp *App) Exit() {
	runtime.Quit(hierachyApp.ctx)
}
