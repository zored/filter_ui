import {App, app, BrowserWindow} from "electron"
import {MainHandler} from "./Message/MainHandler"
import {MainSender} from "./Message/MainSender"
import {Updater} from "./Updater"
import {WindowFactory} from "./WindowFactory"

export class MainApp {
    private window: BrowserWindow = null
    private readonly sender = new MainSender(this.window)
    private readonly updater = new Updater(this.sender)
    private readonly handler = new MainHandler(this.sender, this.updater)

    private constructor(
        private app: App,
        private windowFactory: WindowFactory
    ) {
    }

    static start(): void {
        new MainApp(app, new WindowFactory(process.env.DEBUG === 'Y')).run()
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
        this.updater.initWindow(this.window)
    }

    private closeNonMacOs(): void {
        if (MainApp.isMacOs()) {
            return
        }
        this.app.quit()
    }
}
