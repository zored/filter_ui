import {FilePath} from "../../../../File/FileSystem/FileSystem"
import {RendererChannel} from "../../Channel/RendererChannel"
import {IRendererMessage} from "../IRendererMessage"

export class UndoMessage implements IRendererMessage {
    channel = RendererChannel.undo

    constructor(public likedPath: FilePath, public originalPath: FilePath) {
    }
}
