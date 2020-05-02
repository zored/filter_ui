import {IItemCommand} from "./IItemCommand"

export class Rotate90Command implements IItemCommand {
    constructor(public count90: number) {
    }
}
