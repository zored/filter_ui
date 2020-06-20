import * as fs from "fs"
import * as path from "path"
import {Timeout} from "../../src/Infrastructure/Utils/Timeout"
import {SpectronBuilder} from "../utils/SpectronBuilder"

afterEach(async () => await SpectronBuilder.stopAll())

const cssImage = '#item img'

jest.setTimeout(60000)

test('main app', async () => {
    const app = await SpectronBuilder.start()
    await app.client.waitUntilWindowLoaded()
    expect(app.isRunning()).toBe(true)

    const w = app.browserWindow
    expect(await w.isVisible()).toBe(true)
    expect(await w.getTitle()).toBe('Filter UI')

    // dislike
    const waitImage = async (needle: string) => expect(await app.client
        .waitForVisible(cssImage)
        .getAttribute(cssImage, 'src')
    ).toContain(needle)

    await waitImage('dislike.png')
    app.client.keys('F')
    await waitImage('like.jpg')
    app.client.keys('J')
    await app.client.waitForVisible('#done')
    await Timeout.promise(1000)
    const expectedImages = [
        "like/like.jpg",
        "dislike/dislike.png",
    ]
    expectedImages.forEach(p => expect(
        fs.existsSync(path.join(SpectronBuilder.dataDir, ...p.split('/')))
    ).toBe(true))
})
