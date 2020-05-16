import {IMainMessage} from "../../Message/Message/IMainMessage"
import {IMainSender} from "./IMainSender"
import BrowserWindow = Electron.BrowserWindow

export class MainSender implements IMainSender {
    private lastId = 1

    constructor(public window: BrowserWindow) {
    }

    send(message: IMainMessage): void {
        message.id = this.lastId
        this.lastId++
        this.window.webContents.send(message.channel, message)
    }
}
