import {MyFile} from "../MyFile"
import {PreviousItem} from "./PreviousItem"
import {TimelineItem} from "./TimelineItem"

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

    getCurrentToLike(): TimelineItem | null {
        const item = this.getCurrent()
        if (item === null) {
            return null
        }

        this.current = item.createAfterLike()
        return item
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

    revertPrevious(previous: PreviousItem): void {
        this.previousQueue.push(previous)
        const current = this.nextQueue.pop()
        if (current) {
            this.current = current
        }
    }

    getUpcomingFiles(number: number): MyFile[] {
        return this.nextQueue.slice(this.nextQueue.length - number).map(v => v.file)
    }

    private updateCurrent(): void {
        this.current = this.nextQueue.pop() || null
    }
}
