import * as fs from "fs"
import * as path from "path"
import {Timeout} from "../../Utils/Timeout"

const removeTimeout = 500

export type FilePath = string;

export class FileSystem {
    getMoveToNeighbourDirectoryPath(file: FilePath, directoryName: string): FilePath {
        return path.join(
            path.dirname(file),
            directoryName,
            path.basename(file),
        )
    }

    async movePromise(source: FilePath, newPath: string): Promise<void> {
        this.createDirectorySync(path.dirname(newPath))
        await this.delayMove(source, newPath)
    }

    moveSync(source: string, destination: FilePath, replace: boolean = false) {
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

    private async delayMove(src: string, dist: string): Promise<void> {
        await fs.promises.copyFile(src, dist)
        await this.delayRemove(src)
    }

    private async delayRemove(file: string, retry = 0): Promise<void> {
        await Timeout.promise(removeTimeout)
        await this.remove(file, retry)
    }

    private async remove(file: string, retry = 0): Promise<void> {
        try {
            await fs.promises.unlink(file)
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

    private createDirectorySync(directory: string): void {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }
    }
}
