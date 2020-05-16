import * as fs from "fs"
import {GetFilesMessage} from "../../Electron/Message/Message/Renderer/GetFilesMessage"
import {MyFile} from "../MyFile"
import {MyStats} from "../MyStats"
import {IDirectoryFileRetriever} from "./IDirectoryFileRetriever"

export type FileStack = MyFile[];

type SendInfo = (info: string) => void

export class FileRetriever implements IDirectoryFileRetriever {
    private lastSendInfo: Date = new Date()
    private files: number = 0

    constructor(
        private readonly recursive = false,
        private readonly sendInfo: SendInfo
    ) {
    }

    async getFiles(directories: string[]): Promise<FileStack> {
        this.files = 0
        return (await Promise.all(directories.flatMap(directory => this.getDirectoryFiles(directory)))).flat()
    }

    getFilesMessage(message: GetFilesMessage): Promise<FileStack> {
        return this.getFiles(message.directories)
    }

    private async getDirectoryFiles(dir: string): Promise<FileStack> {
        return (await Promise.all(
            fs.readdirSync(dir).flatMap(fileRelative => this.getMyFiles(dir + '/' + fileRelative))
        )).flat()
    }

    private async getMyFiles(path: string): Promise<MyFile[]> {
        const stats = await fs.promises.lstat(path)
        let isDirectory = stats.isDirectory()
        if (!isDirectory) {
            this.sendInfoOnFile()
            return [new MyFile(path, MyStats.fromStats(stats))]
        }
        if (this.recursive) {
            return this.getDirectoryFiles(path)
        }
        return []
    }

    private sendInfoOnFile(): void {
        this.files++
        const now = new Date()
        if (now.getTime() - this.lastSendInfo.getTime() <= 1000) {
            return
        }
        this.lastSendInfo = now
        this.sendInfo(`Loaded ${this.files} files...`)
    }
}
