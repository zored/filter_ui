export interface IMessage<Id extends number, ThatId, Channel> {
    id?: Id
    responseTo?: ThatId
    channel: Channel
}
