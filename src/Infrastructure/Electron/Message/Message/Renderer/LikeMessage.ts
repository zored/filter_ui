import {FilePath} from "../../../../File/FileSystem/FileSystem"
import {IItemCommand} from "../../../../File/Timeline/Command/IItemCommand"
import {RendererChannel} from "../../Channel/RendererChannel"
import {IRendererMessage, RendererMessageId} from "../IRendererMessage"

export class LikeMessage implements IRendererMessage {
    id: RendererMessageId
    channel = RendererChannel.like

    constructor(
        public like: boolean,
        public fileFrom: FilePath,
        public fileTo: FilePath,
        public commands: IItemCommand[],
    ) {
    }
}
