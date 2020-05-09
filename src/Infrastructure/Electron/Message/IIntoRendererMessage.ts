import {IntoRendererChannel} from "./Channel/IntoRendererChannel"
import {IMessage} from "./IMessage"

export type IntoRendererMessageId = number

export interface IIntoRendererMessage extends IMessage {
    channel: IntoRendererChannel,
    id: IntoRendererMessageId,
}
