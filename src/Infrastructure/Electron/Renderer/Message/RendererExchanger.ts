import {MainChannel} from "../../Message/Channel/MainChannel"
import {RendererChannel} from "../../Message/Channel/RendererChannel"
import {Exchanger} from "../../Message/Exchange/Exchanger"
import {IMainMessage, MainMessageId} from "../../Message/Message/IMainMessage"
import {IRendererMessage, RendererMessageId} from "../../Message/Message/IRendererMessage"

export class RendererExchanger extends Exchanger<IRendererMessage, IMainMessage,
    RendererMessageId, MainMessageId,
    RendererChannel, MainChannel> {
}
