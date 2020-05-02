import {ISubjectActions} from "../../../../Domain/ISubjectActions"
import {Like} from "../../Message/Message/Like"
import {DirectoryPrompt} from "../Input/DirectoryPrompt"
import {RendererSender} from "../Message/RendererSender"
import {Output} from "../Output/Output"
import {FilePath, FileSystem} from "../../../File/FileSystem/FileSystem"
import {ImageRotator} from "../../../File/Image/ImageRotator"
import {ElementFactory} from "../../../File/Markup/ElementFactory"
import {FindSuitableFactory} from "../../../File/Markup/FindSuitableFactory"
import {TitledFactory} from "../../../File/Markup/TitledFactory"
import {MyFile} from "../../../File/MyFile"
import {DirectoryFileRetriever} from "../../../File/Retriever/DirectoryFileRetriever"
import {Rotate90Command} from "../../../File/Timeline/Command/Rotate90Command"
import {Timeline} from "../../../File/Timeline/Timeline"
import {TimelineFactory} from "../../../File/Timeline/TimelineFactory"
import {TimelineItem} from "../../../File/Timeline/TimelineItem"
import {Timeout} from "../../../Utils/Timeout"

type Async = Promise<void>

export class SubjectActions implements ISubjectActions {
    private timeline: Timeline
    private inProgress = 0
    private readonly timelineFactory = new TimelineFactory()
    private readonly elementFactory: ElementFactory = new TitledFactory(new FindSuitableFactory())
    private readonly fs = new FileSystem()
    private readonly directoryPrompt = new DirectoryPrompt()
    private readonly fileRetriever = new DirectoryFileRetriever()
    private readonly imageRotator = new ImageRotator(this.fs)
    private readonly sender = new RendererSender()

    constructor(private readonly output: Output) {
    }

    dislike(): Async {
        return this.setLike(false)
    }

    like(): Async {
        return this.setLike(true)
    }

    async load(): Async {
        this.timeline = await this.createTimeline()
        console.log(this.timeline)
        this.output.activateContent()
        this.refresh()
    }

    async undo(): Async {
        await this.done()
        const item = this.timeline.getPrevious()
        if (item === null) {
            return
        }
        this.fs.moveSync(item.newPath, item.prevPath)
        this.refresh()
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
        while (this.inProgress > 0) {
            await Timeout.promise(1000)
            this.logProgress('wait done')
        }
    }

    async rotate(num90: number): Async {
        const item = this.timeline.getCurrent()
        if (!item) {
            return
        }
        item.commands.push(new Rotate90Command(num90))
    }

    private async withProgress<T>(promise: Promise<T>): Async {
        this.inProgress++
        this.logProgress(' actions in progress (+).')
        try {
            await promise
        } finally {
            this.inProgress--
            this.logProgress(' actions in progress (-).')
        }
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
        this.sender.send(new Like(like))
        const item = this.timeline.getCurrent()
        if (!item) {
            return
        }
        this.output.like(like)
        const directoryName = like ? 'like' : 'dislike'
        const [newPath, moveDone] = this.fs.moveToNeighbourDirectory(item.file.path, directoryName)
        this.withProgress(this.onMoveDone(moveDone, item)).then(() => {})
        this.timeline.toHistory(newPath)
        this.refresh()
    }

    private async onMoveDone(moveDone: Promise<[FilePath, FilePath]>, item: TimelineItem): Async {
        const [,newPath] = await moveDone
        for (const command of item.commands) {
            if (!(command instanceof Rotate90Command)) {
                continue
            }
            await this.withProgress(
                this.imageRotator.rotate90(newPath, command.count90)
            )
        }
    }

    private logProgress(message: string) {
        this.output.setInfo(`${this.inProgress} ${message}`)
    }
}
