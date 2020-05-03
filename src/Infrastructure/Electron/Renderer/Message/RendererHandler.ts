import {ipcRenderer} from 'electron'
import {Progress} from "../../../Utils/Progress"
import {Channels} from "../../Message/Channel/Channels"
import {IntoRendererChannel} from "../../Message/Channel/IntoRendererChannel"
import {IIntoRendererMessage} from "../../Message/IIntoRendererMessage"
import {IRendererHandler} from "../../Message/IRendererHandler"

export class RendererHandler implements IRendererHandler {
    constructor(private progress: Progress) {
    }

    handle(message: IIntoRendererMessage): void {
        const channel = message.channel
        switch (channel) {
            case IntoRendererChannel.likeDone:
            case IntoRendererChannel.undoDone:
                this.progress.decrement()
                break
            default:
                throw new Error(`Unknown channel: ${channel}.`)
        }

    }

    subscribe(): void {
        Channels.subscribe(
            IntoRendererChannel,
            ipcRenderer,
            message => this.handle(message as IIntoRendererMessage)
        )
    }

}
