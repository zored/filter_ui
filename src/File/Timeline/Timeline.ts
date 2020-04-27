import {MyFile} from "../MyFile";
import {NextItem} from "./NextItem";
import {PreviousItem} from "./PreviousItem";

export class Timeline {
    private current: NextItem;

    constructor(
        private nextQueue: NextItem[],
        private previousQueue: PreviousItem[] = []
    ) {
        this.updateCurrent();
    }

    isComplete(): boolean {
        return this.nextQueue.length === 0;
    }

    toHistory(newPath: string): void {
        const previousItem = new PreviousItem(this.current, newPath);
        this.current = null;
        this.previousQueue.push(previousItem);
        this.updateCurrent();
    }

    getCurrentFile(): MyFile {
        return this.current?.file;
    }

    getPrevious(): PreviousItem | null {
        this.nextQueue.push(this.current);
        const previousItem = this.previousQueue.pop();
        if (previousItem === undefined) {
            return null;
        }
        this.current = previousItem.item;
        return previousItem;
    }

    private updateCurrent(): void {
        this.current = this.nextQueue.pop();
    }
}
