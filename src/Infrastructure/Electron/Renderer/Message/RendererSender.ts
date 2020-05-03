import {ipcRenderer} from 'electron'
import {IIntoMainMessage} from "../../Message/IIntoMainMessage"
import {IRendererSender} from "../../Message/IRendererSender"

export class RendererSender implements IRendererSender {
    sendToMain(message: IIntoMainMessage): void {
        ipcRenderer.send(message.channel, message)
    }
}
