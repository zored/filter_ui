import {FileStack} from "./FileRetriever"

export interface IDirectoryFileRetriever {
    getFiles(directories: string[]): Promise<FileStack>
}
