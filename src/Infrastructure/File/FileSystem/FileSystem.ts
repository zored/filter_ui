import * as fs from "fs"
import * as path from "path"
import {Timeout} from "../../Utils/Timeout"

const removeTimeout = 500

export type FilePath = string;

export class FileSystem {
    async movePromise(source: FilePath, newPath: string, copy = false): Promise<void> {
        this.createDirectorySync(path.dirname(newPath))
        await this.delayMove(source, newPath, copy)
    }

    async waitFile(path: FilePath, timeoutMs = 10000, checkIntervalMs = 500): Promise<boolean> {
        const start = new Date().getTime()
        while (true) {
            if (new Date().getTime() - start > timeoutMs) {
                return false
            }
            if (fs.existsSync(path)) {
                return true
            }
            await Timeout.promise(checkIntervalMs)
        }
    }

    async withTmp(path: FilePath, update: (tmp: FilePath) => Promise<void>): Promise<void> {
        const tmp = path + '.tmp'
        await update(tmp)
        this.moveSync(tmp, path, true)
    }

    moveSync(source: FilePath, destination: FilePath, replace: boolean = false): void {
        const destinationExists = fs.existsSync(destination)
        if (destinationExists) {
            if (replace) {
                fs.unlinkSync(destination)

            } else {
                throw new Error(`Can't replace ${destination} with ${source}.`)
            }
        }
        fs.copyFileSync(source, destination)
        fs.unlinkSync(source)
    }

    private async delayMove(src: string, dist: string, copy = false): Promise<void> {
        await fs.promises.copyFile(src, dist)
        if (copy) {
            return
        }
        await this.delayRemove(src)
    }

    private async delayRemove(file: string, retry = 0): Promise<void> {
        await Timeout.promise(removeTimeout)
        await this.removeWhileBusy(file, retry)
    }

    private async removeWhileBusy(file: FilePath, retry = 0): Promise<void> {
        try {
            await this.unlink(file)
            return
        } catch (err) {
            if (err === null) {
                return
            }
            if (err.code != "EBUSY" || retry > 5) {
                throw err
            }
            await this.delayRemove(file, retry + 1)
        }
    }

    private unlink(file: FilePath) {
        return fs.promises.unlink(file)
    }

    private createDirectorySync(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }
    }
}
