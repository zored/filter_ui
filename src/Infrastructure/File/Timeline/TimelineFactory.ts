import {MyFile} from "../MyFile"
import {DefaultPriorityRetriever} from "../Priority/DefaultPriorityRetriever"
import {PriorityRetriever} from "../Priority/PriorityRetriever"
import {TimelineItem} from "./TimelineItem"
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

    private createNextItem(file: MyFile): TimelineItem {
        return new TimelineItem(file, this.priorityRetriever.getPriority(file))
    }
}
