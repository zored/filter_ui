import {MyFile} from "../MyFile"
import {Priority} from "../Priority/PriorityRetriever"
import {IItemCommand} from "./Command/IItemCommand"
import {RotateCommand} from "./Command/RotateCommand"

type Commands = IItemCommand[]

export class TimelineItem {
    public readonly commands: Commands = []

    constructor(public file: MyFile, public priority: Priority) {
    }

    getResultCommands(): Commands {
        console.log(this.commands)
        const result = this.commands.reduce(
            (cs, c) => cs.concat(this.mergeRotates(cs.pop(), c)),
            [] as Commands
        )
        console.log(result)
        return result
    }

    private mergeRotates(previous: IItemCommand, current: IItemCommand): Commands {
        if (!previous) {
            return [current]
        }

        // Not both rotates:
        if (!(current instanceof RotateCommand && previous instanceof RotateCommand)) {
            return [previous, current]
        }
        const count90 = previous.count90 + current.count90
        if (count90 !== 0) {
            return [new RotateCommand(count90)]
        }

        return []
    }

    createAfterLike(): TimelineItem {
        return new TimelineItem(this.file, this.priority)
    }
}
