import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"

export class NotifyUpdateMessage implements IMainMessage {
    channel = MainChannel.update

    constructor(public done: boolean) {
    }
}
