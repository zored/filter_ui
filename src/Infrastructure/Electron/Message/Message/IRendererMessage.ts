import {RendererChannel} from "../Channel/RendererChannel"
import {MainMessageId} from "./IMainMessage"
import {IMessage} from "./IMessage"

export type RendererMessageId = number;

export interface IRendererMessage extends IMessage<RendererMessageId, MainMessageId, RendererChannel> {
}
