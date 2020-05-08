import {ipcRenderer} from 'electron'
import {Progress} from "../../../Utils/Progress"
import {Channels} from "../../Message/Channel/Channels"
import {IntoRendererChannel} from "../../Message/Channel/IntoRendererChannel"
import {IIntoRendererMessage} from "../../Message/IIntoRendererMessage"
import {IRendererHandler} from "../../Message/IRendererHandler"
import {IRendererSender} from "../../Message/IRendererSender"
import {NotifyUpdateMessage} from "../../Message/Message/NotifyUpdateMessage"
import {RestartAndUpdateMessage} from "../../Message/Message/RestartAndUpdateMessage"

export class RendererHandler implements IRendererHandler {
    constructor(private progress: Progress, private sender: IRendererSender) {
    }

    handle(message: IIntoRendererMessage): void {
        const channel = message.channel
        switch (channel) {
            case IntoRendererChannel.likeDone:
                this.progress.decrement()
                break
            case IntoRendererChannel.undoDone:
                this.progress.decrement()
                break
            case IntoRendererChannel.update:
                this.handleUpdate(message as NotifyUpdateMessage)
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

    private handleUpdate(message: NotifyUpdateMessage): void {
        if (!message.done) {
            this.progress.increment()
            this.info('Installing update...')
            return
        }

        this.progress.decrement()
        this.info('Update complete')
        this.sender.sendToMain(new RestartAndUpdateMessage())
    }

    private info(message: string): void {
        console.log(message)
    }
}
