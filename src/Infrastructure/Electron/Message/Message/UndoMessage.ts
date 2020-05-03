import {FilePath} from "../../../File/FileSystem/FileSystem"
import {IntoMainChannel} from "../Channel/IntoMainChannel"
import {IIntoMainMessage} from "../IIntoMainMessage"

export class UndoMessage implements IIntoMainMessage {
    channel = IntoMainChannel.undo

    constructor(public likedPath: FilePath, public originalPath: FilePath) {
    }
}
