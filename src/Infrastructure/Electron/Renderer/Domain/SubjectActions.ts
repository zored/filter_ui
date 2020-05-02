import {ISubjectActions} from "../../../../Domain/ISubjectActions"
import {FileSystem} from "../../../File/FileSystem/FileSystem"
import {ElementFactory} from "../../../File/Markup/ElementFactory"
import {FindSuitableFactory} from "../../../File/Markup/FindSuitableFactory"
import {TitledFactory} from "../../../File/Markup/TitledFactory"
import {MyFile} from "../../../File/MyFile"
import {DirectoryFileRetriever} from "../../../File/Retriever/DirectoryFileRetriever"
import {RotateCommand} from "../../../File/Timeline/Command/RotateCommand"
import {Timeline} from "../../../File/Timeline/Timeline"
import {TimelineFactory} from "../../../File/Timeline/TimelineFactory"
import {LikeMessage} from "../../Message/Message/LikeMessage"
import {DirectoryPrompt} from "../Input/DirectoryPrompt"
import {RendererSender} from "../Message/RendererSender"
import {Output} from "../Output/Output"

type Async = Promise<void>

export class SubjectActions implements ISubjectActions {
    private timeline: Timeline
    private readonly timelineFactory = new TimelineFactory()
    private readonly elementFactory: ElementFactory = new TitledFactory(new FindSuitableFactory())
    private readonly fs = new FileSystem()
    private readonly directoryPrompt = new DirectoryPrompt()
    private readonly fileRetriever = new DirectoryFileRetriever()
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
    }

    async rotate(num90: number): Async {
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
        const item = this.timeline.getCurrent()
        if (!item) {
            return
        }
        this.output.like(like)
        const directoryName = like ? 'like' : 'dislike'
        const newPath = this.fs.getMoveToNeighbourDirectoryPath(item.file.path, directoryName)
        const message = new LikeMessage(like, item.file.path, newPath, item.commands)
        this.sender.sendToMain(message)
        this.timeline.toHistory(newPath)
        this.refresh()
    }
}
