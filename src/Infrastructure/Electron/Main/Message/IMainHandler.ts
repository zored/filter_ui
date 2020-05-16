import {RendererChannel} from "../../Message/Channel/RendererChannel"
import {IHandler} from "../../Message/Exchange/IHandler"
import {MainMessageId} from "../../Message/Message/IMainMessage"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"

export interface IMainHandler extends IHandler<RendererChannel, MainMessageId, IRendererMessage> {
}
