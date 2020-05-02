import {FilePath} from "../../../File/FileSystem/FileSystem"
import {IItemCommand} from "../../../File/Timeline/Command/IItemCommand"
import {Channel} from "../Channel"
import {IMessage} from "../IMessage"

export class LikeMessage implements IMessage {
    channel = Channel.like

    constructor(
        public like: boolean,
        public fileFrom: FilePath,
        public fileTo: FilePath,
        public commands: IItemCommand[],
    ) {
    }
}
