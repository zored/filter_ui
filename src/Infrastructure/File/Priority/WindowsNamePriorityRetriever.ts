import {MyFile} from "../MyFile"
import {Priority, PriorityRetriever} from "./PriorityRetriever"

export class WindowsNamePriorityRetriever implements PriorityRetriever {
    private priority: Priority

    getPriority(file: MyFile): Priority {
        return this.priority
    }

    suits(file: MyFile): boolean {
        const matches = file.path.match(/(\d{4}-\d{2}-\d{2}) (\d{3})/)
        if (!matches) {
            return false
        }
        const [, date, version] = matches
        this.priority = (Date.parse(date) * 1000 + parseInt(version)) / 1000
        return true
    }
}
