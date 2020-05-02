import {FilePath} from "../FileSystem/FileSystem"
import {TimelineItem} from "./TimelineItem"

export class PreviousItem {
    constructor(public item: TimelineItem, public newPath: string) {
    }

    get prevPath(): FilePath {
        return this.item.file.path
    }
}
