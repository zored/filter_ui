import {ipcMain} from 'electron'
import {FileLiker} from "../../../File/Like/FileLiker"
import {Channel} from "../../Message/Channel"
import {IMainHandler} from "../../Message/IMainHandler"
import {IMessage} from "../../Message/IMessage"
import {LikeMessage} from "../../Message/Message/LikeMessage"

export class MainHandler implements IMainHandler {
    private fileLiker = new FileLiker()
    private inProgress = 0

    handle(message: IMessage): void {
        switch (message.channel) {
            case Channel.like:
                this.inProgress++
                this.fileLiker
                    .like(message as LikeMessage)
                    .then(r => r !== null && console.log(r))
                    .finally(() => {
                        this.inProgress--
                    })
                break
        }
    }

    subscribe(): void {
        const channels: Channel[] = Object.entries(Channel).map(([, channels]) => channels)
        this.validateChannels(channels)
        channels.forEach(channel => ipcMain.on(channel, (_, message) => this.handle(message)))
    }

    private validateChannels(channels: Channel[]): void {
        channels.reduce((acc, item) => {
            if (acc.indexOf(item) > -1) {
                throw new Error('Multiple channels with same name are registered.')
            }
            acc.push(item)
            return acc
        }, [] as typeof channels)
    }
}
