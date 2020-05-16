import {IMessage} from "../Message/IMessage"
import {IHandler} from "./IHandler"
import {ISender} from "./ISender"

export class Exchanger<Message extends IMessage<MessageId, ThatMessageId, Channel>, ThatMessage,
    MessageId extends number, ThatMessageId,
    Channel, ThatChannel> {
    constructor(
        private sender: ISender<Message, MessageId, ThatMessageId, Channel>,
        private handler: IHandler<ThatChannel, MessageId, ThatMessage>
    ) {
    }

    async exchange<ThatSpecificMessage extends ThatMessage>(
        message: Message,
        channel: ThatChannel
    ): Promise<ThatSpecificMessage> {
        // noinspection ES6MissingAwait
        const messagePromise = this.handler.waitResponse(channel, message.id) as Promise<ThatSpecificMessage>
        this.sender.send(message)
        return await messagePromise
    }
}
