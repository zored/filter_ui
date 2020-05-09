import {FileStack} from "./DirectoryFileRetriever"

export interface IDirectoryFileRetriever {
    getFiles(directories: string[]): FileStack
}
