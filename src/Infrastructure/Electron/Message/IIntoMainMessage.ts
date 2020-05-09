import {IntoMainChannel} from "./Channel/IntoMainChannel"
import {IntoRendererMessageId} from "./IIntoRendererMessage"
import {IMessage} from "./IMessage"

export interface IIntoMainMessage extends IMessage {
    responseTo?: IntoRendererMessageId,
    channel: IntoMainChannel,
}
