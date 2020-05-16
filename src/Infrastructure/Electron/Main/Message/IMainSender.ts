import {MainChannel} from "../../Message/Channel/MainChannel"
import {ISender} from "../../Message/Exchange/ISender"
import {IMainMessage, MainMessageId} from "../../Message/Message/IMainMessage"
import {RendererMessageId} from "../../Message/Message/IRendererMessage"

export interface IMainSender extends ISender<IMainMessage, MainMessageId, RendererMessageId, MainChannel> {
}
