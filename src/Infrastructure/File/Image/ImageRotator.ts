import * as sharp from 'sharp'
import {FilePath, FileSystem} from "../FileSystem/FileSystem"

export class ImageRotator {
    constructor(private fs: FileSystem) {
        sharp.cache(false)
        sharp.simd()
    }

    async rotate90(path: string, count: number): Promise<void> {
        await this.fs.withTmp(path, async (tmp: FilePath): Promise<void> => {
            await sharp(path)
                .rotate(count * 90)
                .toFile(tmp)
        })
    }
}
