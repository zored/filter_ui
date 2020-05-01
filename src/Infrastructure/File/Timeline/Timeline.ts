import {MyFile} from "../MyFile"
import {NextItem} from "./NextItem"
import {PreviousItem} from "./PreviousItem"

export class Timeline {
    private current: NextItem | null = null

    constructor(
        private readonly nextQueue: NextItem[],
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

    getCurrentFile(): MyFile | null {
        return this.current?.file || null
    }

    getPrevious(): PreviousItem | null {
        if (this.current !== null) {
            this.nextQueue.push(this.current)
        }
        const previous = this.previousQueue.pop() || null
        if (previous === null) {
            return null
        }
        this.current = previous.item
        return previous
    }

    private updateCurrent(): void {
        this.current = this.nextQueue.pop() || null
    }
}
