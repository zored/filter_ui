import * as fs from "fs"
import * as rimraf from "rimraf"
import {Arrays} from "../../src/Infrastructure/Utils/Arrays"
import {Promises} from "../../src/Infrastructure/Utils/Promises"
import {Timeout} from "../../src/Infrastructure/Utils/Timeout"
import {SpectronBuilder} from "../utils/SpectronBuilder"

afterEach(async () => await SpectronBuilder.stopAll())

const cssImage = '#item img'

jest.setTimeout(300000)

test('main app', async () => {
    [
        "dislike",
        "like",
        "*_ignore.*"
    ].forEach(p => rimraf.sync(SpectronBuilder.dataPath(p)))

    const pad = (n: number) => '0'.repeat(n < 100 ? (n < 10 ? 2 : 1) : 0) + n
    const like = (n: number, v: boolean) => v
        ? `2020-12-31 ${pad(n)} like${n > 1 ? '_ignore' : ''}.jpg`
        : `2020-12-31 ${pad(n)} dislike${n > 1 ? '_ignore' : ''}.png`
    const expectedImages: string[] = []

    const total = 1000
    const copies = []
    for (let i = 0; i < total; i++) {
        const isLike = i % 2 === 0
        const name = like(i, isLike)
        expectedImages.unshift((isLike ? 'like/' : 'dislike/') + name)
        if (i < 2) {
            continue
        }
        copies.push(fs.promises.copyFile(
            SpectronBuilder.dataPath(like(i % 2, isLike)),
            SpectronBuilder.dataPath(name)
        ))
    }
    await Promise.all(copies)
    const waitDirFiles = async (dirs: string[], count: number) =>
        expect(await Promises.map(dirs, dir => Timeout.wait(async () =>
            (await fs.promises.readdir(SpectronBuilder.dataPath(dir))).length === count)
        )).toEqual(Array(dirs.length).fill(true))
    await waitDirFiles([''], total)

    const app = await SpectronBuilder.start()
    await app.client.waitUntilWindowLoaded()
    expect(app.isRunning()).toBe(true)

    const w = app.browserWindow
    expect(await w.isVisible()).toBe(true)
    expect(await w.getTitle()).toBe('Filter UI')

    const waitImage = async (needle: string) => {
        let lastSrc = ''
        needle = encodeURIComponent(needle)
        try {
            return await app.client.waitUntil(async function() {
                lastSrc = '' + await app.client.getAttribute(cssImage, 'src')
                return lastSrc.indexOf(needle) >= 0
            })
        } catch (e) {
            fail(`Timeout waiting for "${needle}" in "${lastSrc}": ${e}.`)
        }
    }

    await Promises.map(expectedImages, async s => {
        await waitImage(Arrays.last(s.split('/')))
        await Timeout.promise(50)
        app.client.keys(s.indexOf('dislike') >= 0 ? 'F' : 'J')
    })

    await app.client.waitForVisible('#done')

    await waitDirFiles(['like', 'dislike'], total / 2)
    expectedImages.forEach(p => expect(fs.existsSync(SpectronBuilder.dataPath(p))).toBe(true))
})
