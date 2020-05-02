import {ipcRenderer} from 'electron'
import {IMessage} from "../../Message/IMessage"
import {IRendererSender} from "../../Message/IRendererSender"

export class RendererSender implements IRendererSender {
    send(message: IMessage): void {
        ipcRenderer.send(message.channel, message)
    }
}
