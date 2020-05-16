import {BrowserWindow} from "electron"
import {Path} from "./Path"


export class WindowFactory {
    private readonly options = {
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
        },
        allowRendererProcessReuse: true,
    }

    constructor(private debug: boolean = false) {
    }

    async create(): Promise<BrowserWindow> {
        const window = new BrowserWindow(this.options)
        window.maximize()
        window.setMenu(null)
        if (this.debug) {
            window.webContents.openDevTools()
        }
        await window.loadFile(Path.getAbsolute("html/index.html"))
        return window
    }
}
