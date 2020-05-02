import {ipcMain} from 'electron'
import {Channel} from "../../Message/Channel"
import {IMainHandler} from "../../Message/IMainHandler"
import {IMessage} from "../../Message/IMessage"
import {Like} from "../../Message/Message/Like"

export class MainHandler implements IMainHandler {
    handle(message: IMessage): void {
        switch (message.channel) {
            case Channel.like:
                const likeMessage = message as Like
                console.log('Like: ', likeMessage.like)
        }
    }

    subscribe(): void {
        const channels: Channel[] = Object.entries(Channel).map(([, channels]) => channels)
        this.validateChannels(channels)
        channels.forEach(channel => ipcMain.on(channel, (_, message) => this.handle(message)))
    }

    private validateChannels(channels: Channel[]): void {
        channels.reduce((acc, item, channel) => {
            if (acc.indexOf(item) > -1) {
                throw new Error('Multiple channels with same name are registered.')
            }
            acc.push(item)
            return acc
        }, [] as typeof channels)
    }
}
