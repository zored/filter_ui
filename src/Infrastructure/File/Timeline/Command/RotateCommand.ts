import {CommandId} from "./CommandId"
import {IItemCommand} from "./IItemCommand"

export class RotateCommand implements IItemCommand {
    id = CommandId.rotate90

    constructor(public count90: number) {
    }
}
