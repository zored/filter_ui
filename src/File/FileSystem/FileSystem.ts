import * as fs from "fs";
import * as path from "path";

const removeTimeout = 500;

export type FilePath = string;

export class FileSystem {
    moveToNeighbourDirectory(file: FilePath, directoryName: string): FilePath {
        const directoryPath = path.join(path.dirname(file), directoryName);
        const newPath = path.join(directoryPath, path.basename(file));

        this.createDirectory(directoryPath);
        fs.copyFile(file, newPath, () => this.delayRemove(file));
        return newPath
    }

    private delayRemove(file: string, retry = 0) {
        setTimeout((retry = 0) => this.remove(file, retry), removeTimeout);
    }

    private remove(file: string, retry = 0) {
        fs.unlink(file, err => this.onUnlink(err, file, retry));
    }

    private createDirectory(directory: string) {
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
    }

    private onUnlink(err: NodeJS.ErrnoException, file: string, retry: number): void {
        if (err === null) {
            return;
        }
        if (err.code != "EBUSY" || retry > 5) {
            throw err;
        }
        this.delayRemove(file, retry + 1);
    }

    moveSync(source: string, destination: FilePath) {
        fs.copyFileSync(source, destination);
        fs.unlinkSync(source);
    }
}
