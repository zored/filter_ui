import {FileStack} from "./DirectoryFileRetriever"

export interface IDirectoryFileRetriever {
    getFiles(directories: string[]): Promise<FileStack>
}
