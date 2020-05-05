import {ISubjectActions} from "../../../../Domain/ISubjectActions"
import {Paths} from "../../../File/FileSystem/Paths"
import {ElementFactory} from "../../../File/Markup/ElementFactory"
import {TitledFactory} from "../../../File/Markup/TitledFactory"
import {MyFile} from "../../../File/MyFile"
import {DirectoryFileRetriever} from "../../../File/Retriever/DirectoryFileRetriever"
import {RotateCommand} from "../../../File/Timeline/Command/RotateCommand"
import {Timeline} from "../../../File/Timeline/Timeline"
import {TimelineFactory} from "../../../File/Timeline/TimelineFactory"
import {DirectoryPrompt} from "../Input/DirectoryPrompt"
import {IntoMainEnqueuer} from "../Like/IntoMainEnqueuer"
import {Output} from "../Output/Output"

type Async = Promise<void>

export class SubjectActions implements ISubjectActions {
    private timeline: Timeline
    private readonly timelineFactory = new TimelineFactory()
    private readonly elementFactory: ElementFactory = new TitledFactory()
    private readonly paths = new Paths()
    private readonly directoryPrompt = new DirectoryPrompt()
    private readonly fileRetriever = new DirectoryFileRetriever()
    private readonly intoMain = new IntoMainEnqueuer()
    private first = true

    constructor(private readonly output: Output) {
    }

    async load(): Async {
        await this.done()

        this.timeline = await this.createTimeline()
        this.output.activateContent()
        this.refresh()
        if (this.first) {
            this.intoMain.subscribe()
        }
        this.first = false
    }

    dislike(): Async {
        return this.setLike(false)
    }

    like(): Async {
        return this.setLike(true)
    }

    async undo(): Async {
        await this.loading((async (): Promise<void> => {
            await this.done()

            const item = this.timeline.getPrevious()
            if (item === null) {
                return
            }
            if (!this.intoMain.undo(item)) {
                this.timeline.revertPrevious(item)
                return
            }
            await this.intoMain.done()
            this.refresh()
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
        this.output.setContent(element)
    }

    async done(): Async {
        await this.intoMain.done()
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
        return this.timelineFactory.createFromFiles(
            this.fileRetriever.getFiles(
                await this.directoryPrompt.getDirectories()
            )
        )
    }

    private async setLike(like: boolean): Async {
        const item = this.timeline.getCurrentToLike()
        if (!item) {
            return
        }
        const directoryName = like ? 'like' : 'dislike'
        const newPath = this.paths.getMoveToNeighbourDirectoryPath(item.file.path, directoryName)
        if (!this.intoMain.like(like, item, newPath)) {
            return
        }
        this.output.like(like)
        this.timeline.toHistory(newPath)
        this.refresh()
    }

    private async loading<T>(promise: Promise<T>): Promise<T> {
        return await this.output.setLoadingPromise(promise)
    }
}
