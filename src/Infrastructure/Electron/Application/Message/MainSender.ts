import {IIntoRendererMessage} from "../../Message/IIntoRendererMessage"
import {IMainSender} from "../../Message/IMainSender"
import BrowserWindow = Electron.BrowserWindow

export class MainSender implements IMainSender {
    constructor(public window: BrowserWindow) {
    }

    sendToRenderer(message: IIntoRendererMessage): void {
        this.window.webContents.send(message.channel, message)
    }
}
