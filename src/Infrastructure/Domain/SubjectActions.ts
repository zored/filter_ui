import {ISubjectActions} from "../../Domain/ISubjectActions"
import {DirectoryPrompt} from "../Electron/Renderer/Input/DirectoryPrompt"
import {Output} from "../Electron/Renderer/Output/Output"
import {FileSystem} from "../File/FileSystem/FileSystem"
import {ElementFactory} from "../File/Markup/ElementFactory"
import {FindSuitableFactory} from "../File/Markup/FindSuitableFactory"
import {TitledFactory} from "../File/Markup/TitledFactory"
import {DirectoryFileRetriever} from "../File/Retriever/DirectoryFileRetriever"
import {Timeline} from "../File/Timeline/Timeline"
import {TimelineFactory} from "../File/Timeline/TimelineFactory"
import {Timeout} from "../Utils/Timeout"

export class SubjectActions implements ISubjectActions {
    private timeline: Timeline
    private movingItems = 0
    private readonly timelineFactory = new TimelineFactory()
    private readonly elementFactory: ElementFactory = new TitledFactory(new FindSuitableFactory())
    private readonly fs = new FileSystem()
    private readonly directoryPrompt = new DirectoryPrompt()
    private readonly fileRetriever = new DirectoryFileRetriever()

    constructor(private readonly output: Output) {
    }

    dislike(): void {
        this.setLike(false)
    }

    like(): void {
        this.setLike(true)
    }

    async load(): Promise<void> {
        this.timeline = await this.createTimeline()
        console.log(this.timeline)
        this.output.activateContent()
        this.refresh()
    }

    undo(): void {
        const item = this.timeline.getPrevious()
        if (item === null) {
            return
        }
        this.fs.moveSync(item.newPath, item.prevPath)
        this.refresh()
    }

    refresh(): void {
        const file = this.timeline.getCurrentFile()
        const done = file === null
        this.output.activateContent(!done)
        if (done) {
            return
        }
        const element = this.elementFactory.createElement(file)
        this.output.setContent(element)
    }

    async done(): Promise<void> {
        while (this.movingItems > 0) {
            await Timeout.promise(200)
            console.log(this.movingItems)
        }
    }

    private async createTimeline(): Promise<Timeline> {
        return this.timelineFactory.createFromFiles(
            this.fileRetriever.getFiles(
                await this.directoryPrompt.getDirectories()
            )
        )
    }

    private setLike(like: boolean): void {
        const file = this.timeline.getCurrentFile()
        if (!file) {
            return
        }
        this.output.like(like)
        const directoryName = like ? 'like' : 'dislike'
        const [newPath, moveDone] = this.fs.moveToNeighbourDirectory(file.path, directoryName)
        this.movingItems++
        moveDone.finally(() => this.movingItems--)
        this.timeline.toHistory(newPath)
        this.refresh()
    }
}
