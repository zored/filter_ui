import {FileStack} from "../../../../File/Retriever/FileRetriever"
import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"

export class SendFilesMessage implements IMainMessage {
    channel = MainChannel.sendFiles

    constructor(public files: FileStack) {
    }
}
