import * as fs from "fs"
import * as path from "path"
import {Timeout} from "../../Utils/Timeout"

const removeTimeout = 500

export type FilePath = string;

export class FileSystem {
    moveToNeighbourDirectory(file: FilePath, directoryName: string): [FilePath, Promise<void>] {
        const directoryPath = path.join(path.dirname(file), directoryName)
        const newPath = path.join(directoryPath, path.basename(file))

        this.createDirectory(directoryPath)
        return [newPath, this.delayMove(file, newPath)]
    }

    moveSync(source: string, destination: FilePath) {
        fs.copyFileSync(source, destination)
        fs.unlinkSync(source)
    }

    private async delayMove(src: string, dist: string): Promise<void> {
        await fs.promises.copyFile(src, dist)
        await this.delayRemove(src)
    }

    private async delayRemove(file: string, retry = 0) {
        await Timeout.promise(removeTimeout)
        return this.remove(file, retry)
    }

    private remove(file: string, retry = 0) {
        fs.unlink(file, err => this.onUnlink(err, file, retry))
    }

    private createDirectory(directory: string) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory)
        }
    }

    private onUnlink(err: NodeJS.ErrnoException, file: string, retry: number): void {
        if (err === null) {
            return
        }
        if (err.code != "EBUSY" || retry > 5) {
            throw err
        }
        this.delayRemove(file, retry + 1)
    }
}
