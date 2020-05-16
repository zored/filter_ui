import {MainChannel} from "../Channel/MainChannel"
import {IMessage} from "./IMessage"
import {RendererMessageId} from "./IRendererMessage"

export type MainMessageId = number

/**
 * Comes from main.
 */
export interface IMainMessage extends IMessage<MainMessageId, RendererMessageId, MainChannel> {
}
