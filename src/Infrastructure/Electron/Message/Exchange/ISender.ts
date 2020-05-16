import {IMessage} from "../Message/IMessage"

export interface ISender<Message extends IMessage<Id, ThatId, Channel>, Id extends number, ThatId, Channel> {
    send(message: Message): void
}
