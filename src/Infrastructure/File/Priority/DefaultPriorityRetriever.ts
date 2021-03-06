import {MyFile} from "../MyFile"
import {Priority, PriorityRetriever} from "./PriorityRetriever"
import {StatsPriorityRetriever} from "./StatsPriorityRetriever"
import {WindowsNamePriorityRetriever} from "./WindowsNamePriorityRetriever"

export class DefaultPriorityRetriever implements PriorityRetriever {
    private retrievers: PriorityRetriever[]

    constructor() {
        this.retrievers = [
            new WindowsNamePriorityRetriever(),
            new StatsPriorityRetriever(),
        ]
    }

    getPriority(file: MyFile): Priority {
        const retriever = this.retrievers.find((retriever) => retriever.suits(file))
        if (retriever === undefined) {
            return 0
        }
        return retriever.getPriority(file)
    }

    suits(_: MyFile): boolean {
        return true
    }

}
