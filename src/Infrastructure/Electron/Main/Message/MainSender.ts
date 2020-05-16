import {IMainMessage} from "../../Message/Message/IMainMessage"
import {IMainSender} from "./IMainSender"
import BrowserWindow = Electron.BrowserWindow

export class MainSender implements IMainSender {
    constructor(public window: BrowserWindow) {
    }

    send(message: IMainMessage): void {
        this.window.webContents.send(message.channel, message)
    }
}
