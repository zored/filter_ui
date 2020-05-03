import {PreviousItem} from "../../../File/Timeline/PreviousItem"
import {TimelineItem} from "../../../File/Timeline/TimelineItem"
import {Progress} from "../../../Utils/Progress"
import {IIntoMainMessage} from "../../Message/IIntoMainMessage"
import {LikeMessage} from "../../Message/Message/LikeMessage"
import {UndoMessage} from "../../Message/Message/UndoMessage"
import {RendererHandler} from "../Message/RendererHandler"
import {RendererSender} from "../Message/RendererSender"

export class IntoMainEnqueuer {
    private readonly progress = new Progress("renderer like/undo")
    private readonly handler = new RendererHandler(this.progress)
    private readonly sender = new RendererSender()

    subscribe(): void {
        this.handler.subscribe()
    }

    like(like: boolean, item: TimelineItem, newPath: string): boolean {
        if (!this.progress.increment()) {
            return false
        }
        const message = new LikeMessage(like, item.file.path, newPath, item.getResultCommands())
        this.enqueue(message)
        return true
    }

    async done(): Promise<void> {
        await this.progress.done()
    }

    undo(item: PreviousItem): boolean {
        if (!this.progress.increment()) {
            return false
        }

        const message = new UndoMessage(item.newPath, item.prevPath)
        this.enqueue(message)
        return true
    }

    private enqueue(message: IIntoMainMessage): void {
        this.sender.sendToMain(message)
    }
}
