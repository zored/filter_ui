import {MyFile} from "../MyFile"
import {DefaultPriorityRetriever} from "../Priority/DefaultPriorityRetriever"
import {PriorityRetriever} from "../Priority/PriorityRetriever"
import {Timeline} from "./Timeline"
import {TimelineItem} from "./TimelineItem"

export class TimelineFactory {
    private readonly priorityRetriever: PriorityRetriever = new DefaultPriorityRetriever()

    createFromFiles(files: MyFile[]): Timeline {
        return new Timeline(this.createNextQueue(files))
    }

    private createNextQueue(files: MyFile[]) {
        return files
            .map(file => this.createNextItem(file))
            .sort((left, right) => left.priority - right.priority)
    }

    private createNextItem(file: MyFile): TimelineItem {
        return new TimelineItem(file, this.priorityRetriever.getPriority(file))
    }
}
