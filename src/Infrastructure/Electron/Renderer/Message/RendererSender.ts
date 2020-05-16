import {ipcRenderer} from 'electron'
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {IRendererSender} from "./IRendererSender"

export class RendererSender implements IRendererSender {
    private lastId = 1

    send(message: IRendererMessage): void {
        message.id = this.lastId
        this.lastId++
        ipcRenderer.send(message.channel, message)
    }
}
