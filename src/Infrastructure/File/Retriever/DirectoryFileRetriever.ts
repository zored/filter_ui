import * as fs from "fs"
import {MyFile} from "../MyFile"
import {IDirectoryFileRetriever} from "./IDirectoryFileRetriever"

export type FileStack = MyFile[];

export class DirectoryFileRetriever implements IDirectoryFileRetriever {
    constructor(private readonly recursive = false) {
    }

    getFiles(directories: string[]): FileStack {
        return directories.flatMap(directory => this.getDirectoryFiles(directory))
    }

    private getDirectoryFiles(dir: string): FileStack {
        return fs.readdirSync(dir).flatMap(fileRelative => this.getMyFiles(dir + '/' + fileRelative))
    }

    private getMyFiles(path: string): MyFile[] {
        const stats = fs.lstatSync(path)
        let isDirectory = stats.isDirectory()
        if (!isDirectory) {
            return [new MyFile(path, stats)]
        }
        if (this.recursive) {
            return this.getDirectoryFiles(path)
        }
        return []

    }
}
