import {FileStack} from "../../../File/Retriever/FileRetriever"
import {PreviousItem} from "../../../File/Timeline/PreviousItem"
import {TimelineItem} from "../../../File/Timeline/TimelineItem"
import {Progress} from "../../../Utils/Progress"
import {MainChannel} from "../../Message/Channel/MainChannel"
import {IMainMessage} from "../../Message/Message/IMainMessage"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {LikeDoneMessage} from "../../Message/Message/Main/LikeDoneMessage"
import {SendFilesMessage} from "../../Message/Message/Main/SendFilesMessage"
import {UndoDoneMessage} from "../../Message/Message/Main/UndoDoneMessage"
import {GetFilesMessage} from "../../Message/Message/Renderer/GetFilesMessage"
import {LikeMessage} from "../../Message/Message/Renderer/LikeMessage"
import {UndoMessage} from "../../Message/Message/Renderer/UndoMessage"
import {RendererExchanger} from "../Message/RendererExchanger"
import {RendererHandler} from "../Message/RendererHandler"
import {RendererSender} from "../Message/RendererSender"
import {Output} from "../Output/Output"

export class MainClient {
    private readonly progress = new Progress("MainClient progress")
    private readonly sender = new RendererSender()
    private readonly handler = new RendererHandler(this.progress, this.sender)
    private readonly exchanger = new RendererExchanger(this.sender, this.handler)

    subscribe(output: Output): void {
        this.handler.setOutput(output)
        this.handler.subscribe()
    }

    like(like: boolean, item: TimelineItem, newPath: string): Promise<any> {
        return this.exchange<LikeDoneMessage>(
            new LikeMessage(like, item.file.path, newPath, item.getResultCommands()),
            MainChannel.likeDone
        )
    }

    async done(): Promise<void> {
        await this.progress.done()
    }

    undo(item: PreviousItem): Promise<any> {
        return this.exchange<UndoDoneMessage>(
            new UndoMessage(item.newPath, item.prevPath),
            MainChannel.undoDone
        )
    }

    async getFiles(directories: string[]): Promise<FileStack> {
        const {files} = await this.exchange<SendFilesMessage>(
            new GetFilesMessage(directories),
            MainChannel.sendFiles
        )
        return files
    }

    private async exchange<Message extends IMainMessage>(
        message: IRendererMessage,
        channel: MainChannel
    ): Promise<Message> {
        return await this.progress.wrapPromise(
            this.exchanger.exchange<Message>(message, channel)
        )
    }
}
