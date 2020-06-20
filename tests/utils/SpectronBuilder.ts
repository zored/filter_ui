import * as electron from 'electron'
import * as fs from "fs"
import * as path from "path"
import {Application} from 'spectron'
import {Path} from "../../src/Infrastructure/Electron/Main/Path"

type PackageJson = { main: string }
export type TestApp = Application

export class SpectronBuilder {
    public static readonly dataDir = path.join(
        __dirname,
        ...'../integrational/data'.split('/')
    )
    private static apps: Application[] = []

    public static dataPath = (p: string) =>
        path.join(SpectronBuilder.dataDir, ...p.split('/'))

    static async stopAll(): Promise<Application[]> {
        const apps = await Promise.all(this.apps.map((app: Application) => app.stop()))
        this.apps = []
        return apps
    }

    static async start(): Promise<TestApp> {
        const app = new SpectronBuilder().build()
        await app.start()
        return app
    }

    build(): TestApp {
        const {main} = this.getPackageJson()
        const dir = SpectronBuilder.dataDir

        const app = new Application({
            path: electron + '',
            args: [
                main,
                '--copy', // - preserve original files.
                '--dir', dir,
            ],
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
