import {ipcRenderer} from 'electron'
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {IRendererSender} from "./IRendererSender"

export class RendererSender implements IRendererSender {
    send(message: IRendererMessage): void {
        ipcRenderer.send(message.channel, message)
    }
}
