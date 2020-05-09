import {ipcMain} from 'electron'
import {FileSystem} from "../../../File/FileSystem/FileSystem"
import {FileLiker} from "../../../File/Like/FileLiker"
import {Progress} from "../../../Utils/Progress"
import {Channels} from "../../Message/Channel/Channels"
import {IntoMainChannel} from "../../Message/Channel/IntoMainChannel"
import {IIntoMainMessage} from "../../Message/IIntoMainMessage"
import {IntoRendererMessageId} from "../../Message/IIntoRendererMessage"
import {IMainHandler} from "../../Message/IMainHandler"
import {IMainSender} from "../../Message/IMainSender"
import {LikeDoneMessage} from "../../Message/Message/LikeDoneMessage"
import {LikeMessage} from "../../Message/Message/LikeMessage"
import {RestartAndUpdateMessage} from "../../Message/Message/RestartAndUpdateMessage"
import {UndoDoneMessage} from "../../Message/Message/UndoDoneMessage"
import {UndoMessage} from "../../Message/Message/UndoMessage"
import {Updater} from "../Updater"

export class MainHandler implements IMainHandler {
    private readonly fileLiker = new FileLiker()
    private readonly progress = new Progress("main subject actions")
    private readonly fs = new FileSystem()
    private handlers: Record<IntoMainChannel, (message: IIntoMainMessage) => any> = {
        [IntoMainChannel.like]: this.like,
        [IntoMainChannel.undo]: this.undo,
        [IntoMainChannel.update]: this.restartAndUpdate,
    }
    private waiters: Record<IntoRendererMessageId, (message: IIntoMainMessage) => void>

    constructor(private readonly sender: IMainSender, private updater: Updater) {
    }

    async done(): Promise<void> {
        await this.progress.done()
    }

    wait(channel: IntoMainChannel, id: IntoRendererMessageId): Promise<IIntoMainMessage> {
        return new Promise<IIntoMainMessage>(resolve => this.waiters[id] = resolve)
    }

    subscribe(): void {
        Channels.subscribe(
            IntoMainChannel,
            ipcMain,
            message => this.handle(message as IIntoMainMessage)
        )
    }

    private handle(message: IIntoMainMessage): void {
        const waiter = this.waiters[message.responseTo]
        if (waiter) {
            waiter(message)
            return
        }

        const handler = this.handlers[message.channel]
        if (!handler) {
            throw new Error(`No handler for channel ${message.channel}`)
        }
        handler.apply(this, [message])
    }

    private restartAndUpdate(_: RestartAndUpdateMessage): void {
        this.updater.update()
    }

    private undo(message: UndoMessage): void {
        this.progress.wrapFunc(
            () => this.fs.moveSync(message.likedPath, message.originalPath)
        )
        this.sender.sendToRenderer(new UndoDoneMessage())
    }

    private async like(likeMessage: LikeMessage): Promise<void> {
        await this.progress.wrapPromise(
            this.fileLiker.like(likeMessage)
        )
        this.sender.sendToRenderer(new LikeDoneMessage())
    }
}
