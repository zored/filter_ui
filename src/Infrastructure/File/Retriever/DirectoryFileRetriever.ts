import * as fs from "fs"
import {GetFilesMessage} from "../../Electron/Message/Message/Renderer/GetFilesMessage"
import {MyFile} from "../MyFile"
import {MyStats} from "../MyStats"
import {IDirectoryFileRetriever} from "./IDirectoryFileRetriever"

export type FileStack = MyFile[];

export class DirectoryFileRetriever implements IDirectoryFileRetriever {
    constructor(private readonly recursive = false) {
    }

    async getFiles(directories: string[]): Promise<FileStack> {
        return directories.flatMap(directory => this.getDirectoryFiles(directory))
    }

    private getDirectoryFiles(dir: string): FileStack {
        return fs.readdirSync(dir).flatMap(fileRelative => this.getMyFiles(dir + '/' + fileRelative))
    }

    getFilesMessage(message: GetFilesMessage): Promise<FileStack> {
        return this.getFiles(message.directories)
    }

    private getMyFiles(path: string): MyFile[] {
        const stats = fs.lstatSync(path)
        let isDirectory = stats.isDirectory()
        if (!isDirectory) {
            return [new MyFile(path, MyStats.fromStats(stats))]
        }
        if (this.recursive) {
            return this.getDirectoryFiles(path)
        }
        return []
    }
}
