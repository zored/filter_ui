import * as Jimp from 'jimp'
import {FileSystem} from "../FileSystem/FileSystem"

export class ImageRotator {
    constructor(private fs: FileSystem) {
    }

    async rotate90(path: string, count: number): Promise<void> {
        const image = await Jimp.read(path)
        const tmpPath = path + '.rotate'
        await image.rotate(-count * 90).writeAsync(tmpPath)
        this.fs.moveSync(tmpPath, path, true)
    }
}
