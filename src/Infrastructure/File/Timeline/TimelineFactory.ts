import {MyFile} from "../MyFile"
import {DefaultPriorityRetriever} from "../Priority/DefaultPriorityRetriever"
import {PriorityRetriever} from "../Priority/PriorityRetriever"
import {NextItem} from "./NextItem"
import {Timeline} from "./Timeline"

export class TimelineFactory {
    private readonly priorityRetriever: PriorityRetriever = new DefaultPriorityRetriever()

    createFromFiles(files: MyFile[]): Timeline {
        return new Timeline(this.createNextQueue(files))
    }

    private createNextQueue(files: MyFile[]) {
        return files
            .map(file => this.createNextItem(file))
            .sort((left, right) => right.priority - left.priority)
    }

    private createNextItem(file: MyFile): NextItem {
        return new NextItem(file, this.priorityRetriever.getPriority(file))
    }
}
