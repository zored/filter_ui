import {Stats} from "fs"
import {FilePath} from "./FileSystem/FileSystem"

export class MyFile {
    constructor(public path: FilePath, public stats: Stats) {
    }

    toString(): string {
        return this.path
    }
}
