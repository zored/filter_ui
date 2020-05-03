import {IntoRendererChannel} from "../Channel/IntoRendererChannel"
import {IIntoRendererMessage} from "../IIntoRendererMessage"

export class LikeDoneMessage implements IIntoRendererMessage {
    channel = IntoRendererChannel.likeDone
}
