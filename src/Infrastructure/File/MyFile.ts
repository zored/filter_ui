import {FilePath} from "./FileSystem/FileSystem"
import {MyStats} from "./MyStats"

export class MyFile {
    constructor(public path: FilePath, public stats: MyStats) {
    }

    toString(): string {
        return this.path
    }
}
