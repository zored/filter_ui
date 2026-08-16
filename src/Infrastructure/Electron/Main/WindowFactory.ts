import {BrowserWindow} from "electron"
import {Source} from "../../../Domain/Source"
import {Path} from "./Path"


export class WindowFactory {
    constructor(private debug: boolean = false) {
    }

    async create(source: Source): Promise<BrowserWindow> {
        const window = new BrowserWindow({
            webPreferences: {
                contextIsolation: true,
                nodeIntegration: false,
                preload: Path.getAbsolute('js/Infrastructure/Electron/Preload.js'),
            },
        })
        window.maximize()
        window.setMenu(null)
        if (this.debug) {
            window.webContents.openDevTools()
        }
        await window.loadFile(Path.getAbsolute("html/index.html"), {
            query: {
                directory: source.directory,
                copy: source.copy ? '1' : '0',
            },
        })
        return window
    }
}
