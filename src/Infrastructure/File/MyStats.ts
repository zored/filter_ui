import {Stats} from "fs"

export class MyStats {
    constructor(public mtimeMs: number) {
    }

    static fromStats(stats: Stats): MyStats {
        return new MyStats(stats.mtimeMs)
    }
}
