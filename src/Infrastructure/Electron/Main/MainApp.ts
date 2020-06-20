import {App, app, BrowserWindow, crashReporter} from "electron"
import {argv} from "yargs"
import {Source} from "../../../Domain/Source"
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
        private readonly app: App,
        private readonly windowFactory: WindowFactory,
        private readonly source: Source,
    ) {
    }

    static start(): void {
        const source: Source = {
            directory: (argv.dir || '') as string,
            copy: !!argv.copy,
        }

        new MainApp(
            app,
            new WindowFactory(process.env.DEBUG === 'Y' || (argv.debug as boolean)),
            source
        ).run()
    }

    private static isMacOs(): boolean {
        return process.platform === "darwin"
    }

    run(): void {
        const {app} = this
        app.allowRendererProcessReuse = true
        crashReporter.start({
            productName: 'Filter UI',
            companyName: 'zored',
            submitURL: 'http://localhost:3333/index.php',
            uploadToServer: true,
        })

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
        this.window = await this.windowFactory.create(this.source)
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
