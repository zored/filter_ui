import {remote} from "electron"
import {ISubjectActions} from "../../../../Domain/ISubjectActions"

export class WindowSubscriber {
    constructor(private subject: ISubjectActions) {
    }

    subscribe() {
        window.addEventListener('beforeunload', event => {
            event.returnValue = false
            this.delayClose().then(() => {
            })
        })
    }

    async delayClose() {
        await this.subject.done()
        remote.getCurrentWindow().destroy()
    }
}
