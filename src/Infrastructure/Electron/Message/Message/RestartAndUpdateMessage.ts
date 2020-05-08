import {IntoMainChannel} from "../Channel/IntoMainChannel"
import {IIntoMainMessage} from "../IIntoMainMessage"

export class RestartAndUpdateMessage implements IIntoMainMessage {
    channel = IntoMainChannel.update
}
