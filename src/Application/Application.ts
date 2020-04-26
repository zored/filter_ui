import {App, app, BrowserWindow} from "electron";
import {WindowFactory} from "./WindowFactory";

export class Application {
    private window: BrowserWindow = null;

    static start(): void {
        new Application(app, new WindowFactory()).run();
    }

    constructor(private a: App, private windowFactory: WindowFactory) {
    }

    run(): void {
        this.a.allowRendererProcessReuse = true;
        this.a.on("ready", (): void => this.createWindow());
        this.a.on("activate", (): void => this.createWindow());
        this.a.on("window-all-closed", (): void => !Application.isMacOs() && this.a.quit());
    }

    private static isMacOs(): boolean {
        return process.platform === "darwin";
    }

    private createWindow(): void {
        if (this.window) {
            return;
        }
        this.window = this.windowFactory.create();
        this.window.on("closed", (): void => this.window = null);
    }
}
