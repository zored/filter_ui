import {App, app, BrowserWindow} from "electron"
import {MainHandler} from "./Message/MainHandler"
import {MainSender} from "./Message/MainSender"
import {WindowFactory} from "./WindowFactory"

export class DesktopApp {
    private window: BrowserWindow = null
    private readonly sender = new MainSender(this.window)
    private readonly handler = new MainHandler(this.sender)

    constructor(
        private app: App,
        private windowFactory: WindowFactory
    ) {
    }

    static start(): void {
        new DesktopApp(app, new WindowFactory(process.env.DEBUG === 'Y')).run()
    }

    private static isMacOs(): boolean {
        return process.platform === "darwin"
    }

    run(): void {
        const {app} = this
        app.allowRendererProcessReuse = true
        app.on("ready", () => this.createWindow())
        app.on("activate", () => this.createWindow())
        app.on("window-all-closed", () => this.closeNonMacOs())
        app.on("before-quit", event => this.quitAfterHandler(event))
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
        this.sender.window = this.window
        this.window.on("closed", (): void => this.window = null)
    }

    private closeNonMacOs(): void {
        if (DesktopApp.isMacOs()) {
            return
        }
        this.app.quit()
    }
}
