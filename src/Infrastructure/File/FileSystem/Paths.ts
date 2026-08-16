import {FilePath} from "./FileSystem"

export class Paths {
    getMoveToNeighbourDirectoryPath(file: FilePath, directoryName: string): FilePath {
        const separator = file.includes('\\') ? '\\' : '/'
        const parts = file.split(/[\\/]/)
        const name = parts.pop()
        return [...parts, directoryName, name].join(separator)
    }
}
