import {SpectronBuilder} from "../utils/SpectronBuilder"

afterEach(async () => await SpectronBuilder.stopAll())

test('main app', async () => {
    const app = await SpectronBuilder.start()
    expect(app.browserWindow.isVisible()).toBe(true)
    expect(app.client.getTitle()).toBe('filter_ui')
})
