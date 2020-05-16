import {FileStack} from "../../../../File/Retriever/DirectoryFileRetriever"
import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"

export class SendFilesMessage implements IMainMessage {
    channel = MainChannel.sendFiles

    constructor(public files: FileStack) {
    }
}
