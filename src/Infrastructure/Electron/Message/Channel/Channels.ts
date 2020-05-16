import {IMessage} from "../Message/IMessage"
import EventEmitter = NodeJS.EventEmitter

export class Channels {
    static assertUnique<T>(channels: T[]): T[] {
        channels.reduce((acc, item) => {
            if (acc.indexOf(item) > -1) {
                throw new Error('Multiple channels with same name are registered.')
            }
            acc.push(item)
            return acc
        }, [] as typeof channels)
        return channels
    }

    static eachUnique<T>(channels: Object, f: (item: T) => {}): void {
        Channels.assertUnique(Object
            .entries(channels)
            .map(([, channels]) => channels)
        ).forEach(f)
    }

    static subscribe<T extends string>(channels: Object, ipc: EventEmitter, handle: (message: IMessage) => void) {
        Channels.eachUnique<T>(
            channels,
            channel => ipc.on(channel, (_, message) => handle(message))
        )
    }
}
