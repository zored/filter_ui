import {IntoRendererChannel} from "../Channel/IntoRendererChannel"
import {IIntoRendererMessage} from "../IIntoRendererMessage"

export class NotifyUpdateMessage implements IIntoRendererMessage {
    channel = IntoRendererChannel.update

    constructor(public done: boolean) {
    }
}
