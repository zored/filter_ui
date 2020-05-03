import {IntoRendererChannel} from "../Channel/IntoRendererChannel"
import {IIntoRendererMessage} from "../IIntoRendererMessage"

export class UndoDoneMessage implements IIntoRendererMessage {
    channel = IntoRendererChannel.undoDone
}
