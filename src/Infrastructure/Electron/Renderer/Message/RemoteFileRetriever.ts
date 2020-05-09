import {FileStack} from "../../../File/Retriever/DirectoryFileRetriever"
import {IDirectoryFileRetriever} from "../../../File/Retriever/IDirectoryFileRetriever"

export class RemoteFileRetriever implements IDirectoryFileRetriever {
    getFiles(directories: string[]): FileStack {
        return undefined
    }

}
