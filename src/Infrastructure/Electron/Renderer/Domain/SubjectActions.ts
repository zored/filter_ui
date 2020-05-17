import {ISubjectActions} from "../../../../Domain/ISubjectActions"
import {Paths} from "../../../File/FileSystem/Paths"
import {ElementFactory} from "../../../File/Markup/ElementFactory"
import {TitledFactory} from "../../../File/Markup/TitledFactory"
import {MyFile} from "../../../File/MyFile"
import {RotateCommand} from "../../../File/Timeline/Command/RotateCommand"
import {Timeline} from "../../../File/Timeline/Timeline"
import {TimelineFactory} from "../../../File/Timeline/TimelineFactory"
import {DirectoryPrompt} from "../Input/DirectoryPrompt"
import {MainClient} from "../Like/MainClient"
import {Output} from "../Output/Output"

type Async = Promise<void>

export class SubjectActions implements ISubjectActions {
    private timeline: Timeline
    private readonly timelineFactory = new TimelineFactory()
    private readonly elementFactory: ElementFactory = new TitledFactory()
    private readonly paths = new Paths()
    private readonly directoryPrompt = new DirectoryPrompt()
    private readonly main = new MainClient()
    private first = true

    constructor(private readonly output: Output) {
    }

    async load(): Async {
        await this.done()
        if (this.first) {
            this.main.subscribe(this.output)
        }
        this.timeline = await this.createTimeline()
        this.output.setInfo('')
        this.output.activateContent()
        this.refresh()
        this.first = false
    }

    dislike(): Async {
        return this.setLike(false)
    }

    like(): Async {
        return this.setLike(true)
    }

    async undo(): Async {
        await this.loading((async () => {
            await this.done()

            const item = this.timeline.getPrevious()
            if (item === null) {
                return
            }

            try {
                await this.main.undo(item)
            } catch (e) {
                this.timeline.revertPrevious(item)
            } finally {
                this.refresh()
            }
        })())
    }

    refresh(): void {
        const file = this.getFile()
        const done = !file
        this.output.activateContent(!done)
        if (done) {
            return
        }
        const element = this.elementFactory.createElement(file)

        this.timeline.getUpcomingFiles(10).forEach(file => this.elementFactory.createElement(file))
        this.output.setContent(element)
    }

    async done(): Async {
        await this.main.done()
    }

    async rotate(num90: number): Async {
        this.output.rotateElement(num90)
        const item = this.timeline.getCurrent()
        if (!item) {
            return
        }
        item.commands.push(new RotateCommand(num90))
    }

    private getFile(): MyFile {
        return this.timeline.getCurrent()?.file
    }

    private async createTimeline(): Promise<Timeline> {
        const directories = await this.directoryPrompt.getDirectories()
        const files = await this.main.getFiles(directories)
        return this.timelineFactory.createFromFiles(files)
    }

    private async setLike(like: boolean): Async {
        const item = this.timeline.getCurrentToLike()
        if (!item) {
            return
        }
        const directoryName = like ? 'like' : 'dislike'
        const newPath = this.paths.getMoveToNeighbourDirectoryPath(item.file.path, directoryName)
        this.main.like(like, item, newPath).then(() => {
        })
        this.output.like(like)
        this.timeline.toHistory(newPath)
        this.refresh()
    }

    private async loading<T>(promise: Promise<T>): Promise<T> {
        return await this.output.setLoadingPromise(promise)
    }
}
