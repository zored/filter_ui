import {RendererChannel} from "../../Channel/RendererChannel"
import {IRendererMessage} from "../IRendererMessage"

export class RestartAndUpdateMessage implements IRendererMessage {
    channel = RendererChannel.update
}
