import {BrowserWindow} from "electron";
import * as fs from "fs";
import * as path from "path";

const html = "html/index.html";

export class WindowFactory {
    private readonly options = {
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
        },
        allowRendererProcessReuse: true,
    };

    create(): BrowserWindow {
        const window = new BrowserWindow(this.options);
        window.maximize();
        window.setMenu(null);
        window.loadFile(WindowFactory.getPath(html)).catch(e => {
            throw new Error(e);
        });
        return window;
    }

    private static getPath(relative: string): string {
        const allPaths = ["/app/", "/../../"].map(inner => path.join(__dirname, inner, relative));
        const suitablePaths = allPaths.filter(p => fs.existsSync(p));
        if (suitablePaths.length === 0) {
            throw new Error(`no path with "${relative}" found in: ${allPaths.join(', ')}`);
        }
        return suitablePaths[0];
    }
}
