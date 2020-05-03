import {IntoRendererChannel} from "./Channel/IntoRendererChannel"
import {IMessage} from "./IMessage"

export interface IIntoRendererMessage extends IMessage {
    channel: IntoRendererChannel,
}
