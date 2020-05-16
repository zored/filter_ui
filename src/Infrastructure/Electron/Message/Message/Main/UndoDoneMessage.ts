import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"

export class UndoDoneMessage implements IMainMessage {
    channel = MainChannel.undoDone
}
