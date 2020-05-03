import * as path from "path"
import {FilePath} from "./FileSystem"

export class Paths {
    getMoveToNeighbourDirectoryPath(file: FilePath, directoryName: string): FilePath {
        return path.join(
            path.dirname(file),
            directoryName,
            path.basename(file),
        )
    }
}
