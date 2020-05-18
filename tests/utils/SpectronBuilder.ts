import * as electron from 'electron'
import * as fs from "fs"
import {Application} from 'spectron'
import {Path} from "../../src/Infrastructure/Electron/Main/Path"

type PackageJson = { main: string }
export type TestApp = Application

export class SpectronBuilder {
    private static apps: Application[] = []

    static async stopAll(): Promise<Application[]> {
        const apps = await Promise.all(this.apps.map((app: Application) => app.stop()))
        this.apps = [];
        return apps
    }

    static async start(): Promise<TestApp> {
        const filePaths = ['like.jpg', 'dislike.png']
            .map(name => Path.getAbsolute(`tests/integrational/data/${name}`))


        const app = new SpectronBuilder().build()
        await app.start()

        return app
    }

    build(): TestApp {
        const {main} = this.getPackageJson()
        const app = new Application({
            path: electron + '',
            args: [main],
            startTimeout: 30000,
        })
        SpectronBuilder.apps.push(app)
        return app
    }

    private getPackageJson(): PackageJson {
        const file = fs.readFileSync(Path.getAbsolute('package.json')).toString()
        return JSON.parse(file)
    }
}
