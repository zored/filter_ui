import {FilePath} from "../../../File/FileSystem/FileSystem"
import {IItemCommand} from "../../../File/Timeline/Command/IItemCommand"
import {IntoMainChannel} from "../Channel/IntoMainChannel"
import {IIntoMainMessage} from "../IIntoMainMessage"

export class LikeMessage implements IIntoMainMessage {
    channel = IntoMainChannel.like

    constructor(
        public like: boolean,
        public fileFrom: FilePath,
        public fileTo: FilePath,
        public commands: IItemCommand[],
    ) {
    }
}
