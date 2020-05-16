import {autoUpdater} from "electron-updater"
import {IMainMessage} from "../Message/Message/IMainMessage"
import {NotifyUpdateMessage} from "../Message/Message/Main/NotifyUpdateMessage"
import {IMainSender} from "./Message/IMainSender"
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

    private send(message: IMainMessage): void {
        this.sender.send(message)
    }
}
