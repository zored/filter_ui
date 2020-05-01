import {BrowserWindow} from "electron"
import * as fs from "fs"
import * as path from "path"


export class WindowFactory {
    private readonly options = {
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
        allowRendererProcessReuse: true,
    }

    constructor(private debug: boolean = false) {
    }

    private static getPath(relative: string): string {
        const allPaths = ["/app/", "/..".repeat(4)].map(inner => path.join(__dirname, inner, relative))
        const suitablePaths = allPaths.filter(p => fs.existsSync(p))
        if (suitablePaths.length === 0) {
            throw new Error(`no path with "${relative}" found in: ${allPaths.join(', ')}`)
        }
        return suitablePaths[0]
    }

    async create(): Promise<BrowserWindow> {
        const window = new BrowserWindow(this.options)
        window.maximize()
        window.setMenu(null)
        if (this.debug) {
            window.webContents.openDevTools()
        }
        await window.loadFile(WindowFactory.getPath("html/index.html"))
        return window
    }
}
