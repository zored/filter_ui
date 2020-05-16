import {ipcRenderer} from 'electron'
import {Progress} from "../../../Utils/Progress"
import {Channels} from "../../Message/Channel/Channels"
import {MainChannel} from "../../Message/Channel/MainChannel"
import {IMainMessage} from "../../Message/Message/IMainMessage"
import {RendererMessageId} from "../../Message/Message/IRendererMessage"
import {InfoMessage} from "../../Message/Message/Main/InfoMessage"
import {NotifyUpdateMessage} from "../../Message/Message/Main/NotifyUpdateMessage"
import {RestartAndUpdateMessage} from "../../Message/Message/Renderer/RestartAndUpdateMessage"
import {Output} from "../Output/Output"
import {IRendererHandler} from "./IRendererHandler"
import {IRendererSender} from "./IRendererSender"

export class RendererHandler implements IRendererHandler {
    private waiters: Record<RendererMessageId, (message: IMainMessage) => void> = {}
    private output: Output | undefined

    constructor(private progress: Progress, private sender: IRendererSender) {
    }

    handle(message: IMainMessage): void {
        const waiter = this.waiters[message.responseTo]
        if (waiter) {
            delete this.waiters[message.responseTo]
            waiter(message)
            return
        }

        const channel = message.channel
        switch (channel) {
            case MainChannel.update:
                this.handleUpdate(message as NotifyUpdateMessage)
                break
            case MainChannel.info:
                const output = this.output
                if (!output) {
                    break
                }
                output.setInfo((message as InfoMessage).text)
                break
            default:
                throw new Error(`Unknown channel: ${channel}.`)
        }

    }

    subscribe(): void {
        Channels.subscribe(
            MainChannel,
            ipcRenderer,
            message => this.handle(message as IMainMessage)
        )
    }

    waitResponse(channel: MainChannel, inResponseToId: RendererMessageId): Promise<IMainMessage> {
        return new Promise<IMainMessage>(resolve => this.waiters[inResponseToId] = resolve)
    }

    setOutput(output: Output): void {
        this.output = output
    }

    private handleUpdate(message: NotifyUpdateMessage): void {
        if (!message.done) {
            this.progress.increment()
            this.info('Installing update...')
            return
        }

        this.progress.decrement()
        this.info('Update complete')
        this.sender.send(new RestartAndUpdateMessage())
    }

    private info(message: string): void {
        console.log(message)
    }
}
