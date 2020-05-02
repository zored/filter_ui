import {App, app, BrowserWindow} from "electron"
import {MainHandler} from "./Message/MainHandler"
import {WindowFactory} from "./WindowFactory"

export class DesktopApp {
    private window: BrowserWindow = null
    private readonly handler = new MainHandler()

    constructor(
        private app: App,
        private windowFactory: WindowFactory
    ) {
    }

    static start(): void {
        new DesktopApp(app, new WindowFactory(true)).run()
    }

    private static isMacOs(): boolean {
        return process.platform === "darwin"
    }

    run(): void {
        this.app.allowRendererProcessReuse = true
        this.app.on("ready", () => this.createWindow())
        this.app.on("activate", () => this.createWindow())
        this.app.on("window-all-closed", () => this.closeNonMacOs())
        this.app.on("before-quit", event => this.quitAfterHandler(event))
        this.handler.subscribe()
    }

    private quitAfterHandler(event: Electron.Event): void {
        event.returnValue = false
        this.handler.done().finally(() => this.app.exit(0))
    }

    private async createWindow(): Promise<void> {
        if (this.window) {
            return
        }
        this.window = await this.windowFactory.create()
        this.window.on("closed", (): void => this.window = null)
    }

    private closeNonMacOs(): void {
        if (DesktopApp.isMacOs()) {
            return
        }
        this.app.quit()
    }
}
