import {IIntoRendererMessage} from "../../Message/IIntoRendererMessage"
import {IMainSender} from "../../Message/IMainSender"
import BrowserWindow = Electron.BrowserWindow

export class MainSender implements IMainSender {
    private lastId = 0
    constructor(public window: BrowserWindow) {
    }

    sendToRenderer(message: IIntoRendererMessage): void {
        this.lastId++
        message.id = this.lastId
        this.window.webContents.send(message.channel, message)
    }
}
