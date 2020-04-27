import {MyFile} from "../MyFile";
import {Priority} from "../Priority/PriorityRetriever";

export class NextItem {
    constructor(public file: MyFile, public priority: Priority) {
    }
}
