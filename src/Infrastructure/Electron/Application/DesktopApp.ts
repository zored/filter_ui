import {App, app, BrowserWindow} from "electron"
import {WindowFactory} from "./WindowFactory"

export class DesktopApp {
    private window: BrowserWindow = null

    constructor(private app: App, private windowFactory: WindowFactory) {
    }

    static start(): void {
        new DesktopApp(app, new WindowFactory(process.env.DEBUG === 'Y')).run()
    }

    private static isMacOs(): boolean {
        return process.platform === "darwin"
    }

    run(): void {
        this.app.allowRendererProcessReuse = true
        this.app.on("ready", () => this.createWindow())
        this.app.on("activate", () => this.createWindow())
        this.app.on("window-all-closed", () => this.closeNonMacOs())
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
