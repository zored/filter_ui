import * as fs from "fs"
import * as path from "path"

export class Path {
    static getAbsolute(relative: string): string {
        const allPaths = ["/app/", "/..".repeat(4)].map(inner => path.join(__dirname, inner, relative))
        const suitablePaths = allPaths.filter(p => fs.existsSync(p))
        if (suitablePaths.length === 0) {
            throw new Error(`no path with "${relative}" found in: ${allPaths.join(', ')}`)
        }
        return suitablePaths[0]
    }
}
