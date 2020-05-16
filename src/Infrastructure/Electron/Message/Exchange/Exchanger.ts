import {IMessage} from "../Message/IMessage"
import {IHandler} from "./IHandler"
import {ISender} from "./ISender"

export class Exchanger<Message extends IMessage<MessageId, ThatMessageId, Channel>, ThatMessage,
    MessageId extends number, ThatMessageId,
    Channel, ThatChannel> {
    private lastId: MessageId = 1 as MessageId
    constructor(
        private sender: ISender<Message, MessageId, ThatMessageId, Channel>,
        private handler: IHandler<ThatChannel, MessageId, ThatMessage>
    ) {
    }

    async exchange<ThatSpecificMessage extends ThatMessage>(
        message: Message,
        channel: ThatChannel
    ): Promise<ThatSpecificMessage> {
        message.id = this.lastId
        this.lastId++
        // noinspection ES6MissingAwait
        const messagePromise = this.handler.waitResponse(channel, message.id) as Promise<ThatSpecificMessage>
        this.sender.send(message)
        return await messagePromise
    }
}
