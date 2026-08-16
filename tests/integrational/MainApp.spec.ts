import {expect, test, _electron as electron} from '@playwright/test'
import {promises as fs} from 'node:fs'
import os from 'node:os'
import path from 'node:path'

const repositoryRoot = path.resolve(__dirname, '../..')
const appEntry = path.join(repositoryRoot, 'js/Infrastructure/main_app.js')
const testData = path.join(repositoryRoot, 'tests/integrational/data')
const filesIn = (directory: string, target: string) => fs.readdir(path.join(directory, target)).catch(() => [])

test('filters files through the secured Electron renderer', async () => {
    const directory = await fs.mkdtemp(path.join(os.tmpdir(), 'filter-ui-'))
    const files = ['2020-12-31 000 like.jpg', '2020-12-31 001 dislike.png']
    await Promise.all(files.map(file => fs.copyFile(path.join(testData, file), path.join(directory, file))))

    const app = await electron.launch({args: [appEntry, '--copy', '--dir', directory]})
    try {
        const window = await app.firstWindow()
        const currentImage = window.locator('#item img[style*="opacity: 1"]')
        const initialSource = await currentImage.getAttribute('src')
        expect(initialSource).not.toBeNull()
        await window.keyboard.press('KeyJ')
        await expect.poll(() => currentImage.getAttribute('src')).not.toBe(initialSource)
        await expect.poll(() => filesIn(directory, 'like')).toHaveLength(1)
        await window.keyboard.press('KeyF')
        await expect(window.locator('#done')).toBeVisible()
        await expect.poll(() => filesIn(directory, 'dislike')).toHaveLength(1)
    } finally {
        await app.close()
        await fs.rm(directory, {recursive: true, force: true})
    }
})
