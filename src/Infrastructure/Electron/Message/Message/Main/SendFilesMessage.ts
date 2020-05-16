import {FileStack} from "../../../../File/Retriever/DirectoryFileRetriever"
import {MainChannel} from "../../Channel/MainChannel"
import {IMainMessage} from "../IMainMessage"
import {RendererMessageId} from "../IRendererMessage"

export class SendFilesMessage implements IMainMessage {
    channel = MainChannel.sendFiles

    constructor(
        public files: FileStack,
        public responseTo: RendererMessageId
    ) {
    }
}
