import {Worker} from "worker_threads"
import {Promises} from "../../../Utils/Promises"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {InfoMessage} from "../../Message/Message/Main/InfoMessage"
import {IMainSender} from "../Message/IMainSender"
import {Path} from "../Path"
import {WorkerRequest} from "./WorkerRequest"
import {WorkerResponse} from "./WorkerResponse"

export class WorkerForRenderer {
    private lock = Promises.createLock(20)
    private worker?: Worker
    private requester?: (message: IRendererMessage) => Promise<WorkerResponse>

    constructor(private sender: IMainSender) {
    }

    workOnMessage = (message: IRendererMessage): Promise<any> =>
        this.lock(() => this.doWorkOnMessage(message))

    private getRequester = () => {
        if (this.requester) {
            return this.requester
        }

        this.worker = this.createWorker()
        this.worker.addListener('message', (r: WorkerResponse) => {
            if (r.info !== undefined) {
                this.sender.send(new InfoMessage(r.info))
                return
            }
        })

        const {listener, request} = Promises.forEvents<WorkerResponse>(r => r.requestId)
        this.worker.addListener('message', listener)
        return this.requester = (message: IRendererMessage) =>
            request(id => this.worker.postMessage(new WorkerRequest(id, message)))
    }

    private createWorker = () =>
        new Worker(Path.getAbsolute('js/Infrastructure/worker_renderer.js'))

    private sendMessage = async (message: IRendererMessage): Promise<WorkerResponse> =>
        await this.getRequester()(message)

    private doWorkOnMessage = async (message: IRendererMessage) =>
        (await this.sendMessage(message)).data
}
