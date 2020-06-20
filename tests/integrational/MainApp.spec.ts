import * as fs from "fs"
import * as path from "path"
import {Timeout} from "../../src/Infrastructure/Utils/Timeout"
import {SpectronBuilder} from "../utils/SpectronBuilder"

afterEach(async () => await SpectronBuilder.stopAll())

jest.setTimeout(60000)
test('main app', async () => {
    const app = await SpectronBuilder.start()
    await app.client.waitUntilWindowLoaded()
    expect(app.isRunning()).toBe(true)

    const w = app.browserWindow
    expect(await w.isVisible()).toBe(true)
    expect(await w.getTitle()).toBe('Filter UI')

    app.client.keys('F') // - dislike image
    await Timeout.promise(1000) // todo: wait something
    app.client.keys('J') // - like image
    await Timeout.promise(1000);

    [
        "like/like.jpg",
        "dislike/dislike.png",
    ].forEach(p => expect(
        fs.existsSync(path.join(SpectronBuilder.dataDir, ...p.split('/')))
    ).toBe(true))
})
