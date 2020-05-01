import {FilePath} from "../FileSystem/FileSystem"
import {NextItem} from "./NextItem"

export class PreviousItem {
    constructor(public item: NextItem, public newPath: string) {
    }

    get prevPath(): FilePath {
        return this.item.file.path
    }
}
