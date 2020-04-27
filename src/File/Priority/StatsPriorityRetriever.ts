import {MyFile} from "../MyFile";
import {Priority, PriorityRetriever} from "./PriorityRetriever";

export class StatsPriorityRetriever implements PriorityRetriever {
    getPriority(file: MyFile): Priority {
        return file.stats.mtimeMs;
    }

    suits(file: MyFile): boolean {
        return file.stats !== undefined;
    }
}
