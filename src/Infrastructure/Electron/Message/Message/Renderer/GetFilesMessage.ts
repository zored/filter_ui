import {RendererChannel} from "../../Channel/RendererChannel"
import {IRendererMessage, RendererMessageId} from "../IRendererMessage"

export class GetFilesMessage implements IRendererMessage {
    id: RendererMessageId
    channel = RendererChannel.getFiles

    constructor(public directories: string[]) {

    }
}
