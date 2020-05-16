import {RendererChannel} from "../../Message/Channel/RendererChannel"
import {ISender} from "../../Message/Exchange/ISender"
import {MainMessageId} from "../../Message/Message/IMainMessage"
import {IRendererMessage, RendererMessageId} from "../../Message/Message/IRendererMessage"

export interface IRendererSender extends ISender<IRendererMessage, RendererMessageId, MainMessageId, RendererChannel> {
}
