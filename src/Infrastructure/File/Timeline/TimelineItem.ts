import {MyFile} from "../MyFile"
import {Priority} from "../Priority/PriorityRetriever"
import {IItemCommand} from "./Command/IItemCommand"

export class TimelineItem {
    public readonly commands: IItemCommand[] = []
    constructor(public file: MyFile, public priority: Priority) {
    }
}
