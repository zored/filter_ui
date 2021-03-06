import {ipcMain} from 'electron'
import {FileSystem} from "../../../File/FileSystem/FileSystem"
import {FileStack} from "../../../File/Retriever/FileRetriever"
import {Progress} from "../../../Utils/Progress"
import {Channels} from "../../Message/Channel/Channels"
import {RendererChannel} from "../../Message/Channel/RendererChannel"
import {IMainMessage, MainMessageId} from "../../Message/Message/IMainMessage"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {LikeDoneMessage} from "../../Message/Message/Main/LikeDoneMessage"
import {SendFilesMessage} from "../../Message/Message/Main/SendFilesMessage"
import {UndoDoneMessage} from "../../Message/Message/Main/UndoDoneMessage"
import {GetFilesMessage} from "../../Message/Message/Renderer/GetFilesMessage"
import {LikeMessage} from "../../Message/Message/Renderer/LikeMessage"
import {RestartAndUpdateMessage} from "../../Message/Message/Renderer/RestartAndUpdateMessage"
import {UndoMessage} from "../../Message/Message/Renderer/UndoMessage"
import {Updater} from "../Updater"
import {WorkerForRenderer} from "../Worker/WorkerForRenderer"
import {IMainHandler} from "./IMainHandler"
import {IMainSender} from "./IMainSender"

export class MainHandler implements IMainHandler {
    private readonly progress = new Progress("main subject actions")
    private readonly fs = new FileSystem()
    private readonly handlers: Record<RendererChannel, (message: IRendererMessage) => any> = {
        [RendererChannel.like]: this.like,
        [RendererChannel.undo]: this.undo,
        [RendererChannel.update]: this.restartAndUpdate,
        [RendererChannel.getFiles]: this.getFiles,
    }
    private readonly waiters: Record<MainMessageId, (message: IRendererMessage) => void> = {}
    private readonly worker = new WorkerForRenderer(this.sender)

    constructor(
        private readonly sender: IMainSender,
        private readonly updater: Updater,
    ) {
    }

    done = () => this.progress.done()

    waitResponse(channel: RendererChannel, inResponseTo: MainMessageId): Promise<IRendererMessage> {
        return new Promise<IRendererMessage>(resolve => this.waiters[inResponseTo] = resolve)
    }

    subscribe(): void {
        Channels.subscribe(
            RendererChannel,
            ipcMain,
            message => this.handle(message as IRendererMessage)
        )
    }

    handle(message: IRendererMessage): void {
        const waiter = this.waiters[message.responseTo]
        if (waiter) {
            delete this.waiters[message.responseTo]
            waiter(message)
            return
        }

        const handler = this.handlers[message.channel]
        if (!handler) {
            throw new Error(`No handler for channel ${message.channel}`)
        }
        handler.apply(this, [message])
    }

    private async getFiles(message: GetFilesMessage): Promise<void> {
        const files: FileStack = await this.toWorker(message)
        this.respond(message, new SendFilesMessage(files))
    }

    private respond(messageIn: IRendererMessage, messageOut: IMainMessage): void {
        messageOut.responseTo = messageIn.id
        this.sender.send(messageOut)
    }

    private restartAndUpdate(_: RestartAndUpdateMessage): void {
        this.updater.update()
    }

    private undo(message: UndoMessage): void {
        this.progress.wrapFunc(
            () => this.fs.moveSync(message.likedPath, message.originalPath)
        )
        this.respond(message, new UndoDoneMessage())
    }

    private async like(message: LikeMessage): Promise<void> {
        await this.toWorker(message)
        this.sender.send(new LikeDoneMessage(message.id))
    }

    private async toWorker(message: IRendererMessage): Promise<any> {
        return await this.progress.wrapPromise(
            this.worker.workOnMessage(message)
        )
    }
}
