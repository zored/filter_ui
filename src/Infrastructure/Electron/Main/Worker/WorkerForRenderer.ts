import {once} from "events"
import {Worker} from "worker_threads"
import {Promises} from "../../../Utils/Promises"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {InfoMessage} from "../../Message/Message/Main/InfoMessage"
import {IMainSender} from "../Message/IMainSender"
import {Path} from "../Path"
import {WorkerMessage} from "./WorkerMessage"

export class WorkerForRenderer {
    private lock = Promises.createLock(20)

    constructor(private sender: IMainSender) {
    }

    workOnMessage = (message: IRendererMessage): Promise<any> =>
        this.lock(() => this.doWorkOnMessage(message))

    private async doWorkOnMessage(message: IRendererMessage): Promise<any> {
        const path = Path.getAbsolute('js/Infrastructure/worker_renderer.js')
        const worker = new Worker(path, {workerData: message})
        let result: any = null
        worker.on('message', (message: WorkerMessage) => {
            result = message.data

            const info = message.info
            if (info !== undefined) {
                this.sender.send(new InfoMessage(info))
            }

            if (message.final) {
                worker.terminate()
            }
        })
        await once(worker, 'exit')
        return result
    }
}
