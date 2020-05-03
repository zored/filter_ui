import {IntoMainChannel} from "./Channel/IntoMainChannel"
import {IMessage} from "./IMessage"

export interface IIntoMainMessage extends IMessage {
    channel: IntoMainChannel,
}
