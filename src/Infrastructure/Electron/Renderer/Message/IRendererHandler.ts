import {MainChannel} from "../../Message/Channel/MainChannel"
import {IHandler} from "../../Message/Exchange/IHandler"
import {IMainMessage} from "../../Message/Message/IMainMessage"
import {RendererMessageId} from "../../Message/Message/IRendererMessage"

export interface IRendererHandler extends IHandler<MainChannel, RendererMessageId, IMainMessage> {
}
