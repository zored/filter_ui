import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"

export class InfoMessage implements IMainMessage {
    channel = MainChannel.info

    constructor(public text: string) {
    }
}
