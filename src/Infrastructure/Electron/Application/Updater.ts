import {autoUpdater} from "electron-updater"
import {IIntoRendererMessage} from "../Message/IIntoRendererMessage"
import {IMainSender} from "../Message/IMainSender"
import {NotifyUpdateMessage} from "../Message/Message/NotifyUpdateMessage"
import BrowserWindow = Electron.BrowserWindow

export class Updater {

    constructor(private sender: IMainSender) {
    }

    initWindow(window: BrowserWindow) {
        window.once("ready-to-show", () => autoUpdater.checkForUpdatesAndNotify())
        autoUpdater.on('update-available', () => this.send(new NotifyUpdateMessage(false)))
        autoUpdater.on('update-downloaded', () => this.send(new NotifyUpdateMessage(true)))
    }

    update(): void {
        autoUpdater.quitAndInstall()
    }

    private send(message: IIntoRendererMessage): void {
        this.sender.sendToRenderer(message)
    }
}
