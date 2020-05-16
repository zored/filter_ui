import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"
import {RendererMessageId} from "../IRendererMessage"

export class LikeDoneMessage implements IMainMessage {
    channel = MainChannel.likeDone

    constructor(public responseTo: RendererMessageId) {
    }
}
