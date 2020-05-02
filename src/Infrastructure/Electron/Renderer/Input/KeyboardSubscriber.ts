import {ISubjectActions} from "../../../../Domain/ISubjectActions"
import {ISubjectOptions} from "../../../../Domain/ISubjectOptions"

export class KeyboardSubscriber {
    private readonly actionByKey: Record<string, () => void>

    constructor(private subject: ISubjectActions, private options: ISubjectOptions) {
        this.actionByKey = {
            F: () => subject.dislike(),
            J: () => subject.like(),

            L: () => subject.undo(),
            S: () => subject.refresh(),
            O: () => subject.load(),

            P: () => subject.rotate(+1),
            Q: () => subject.rotate(+1),

            D: () => options.addVideoSpeed(+1),
            K: () => options.addVideoSpeed(-1),
        }
    }

    public subscribe(): void {
        document.addEventListener('keyup', (event) => this.call(event.code))
    }

    private call(code: string): boolean {
        const matches = code.match(/^Key(.+)$/i)
        if (!matches) {
            return true
        }

        const [, key] = matches

        const action = this.actionByKey[key]
        if (action !== undefined) {
            action()
        }
        return false
    }
}
