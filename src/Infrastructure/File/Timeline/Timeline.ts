import {MyFile} from "../MyFile"
import {TimelineItem} from "./TimelineItem"
import {PreviousItem} from "./PreviousItem"

export class Timeline {
    private current: TimelineItem | null = null

    constructor(
        private readonly nextQueue: TimelineItem[],
        private readonly previousQueue: PreviousItem[] = []
    ) {
        this.updateCurrent()
    }

    toHistory(newPath: string): void {
        const previousItem = new PreviousItem(this.current, newPath)
        this.current = null
        this.previousQueue.push(previousItem)
        this.updateCurrent()
    }

    getCurrent(): TimelineItem | null {
        return this.current || null
    }

    getPrevious(): PreviousItem | null {
        const previous = this.previousQueue.pop() || null
        if (previous === null) {
            return null
        }
        if (this.current !== null) {
            this.nextQueue.push(this.current)
        }
        this.current = previous.item
        return previous
    }

    private updateCurrent(): void {
        this.current = this.nextQueue.pop() || null
    }
}
