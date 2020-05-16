import {once} from "events"
import {Worker} from "worker_threads"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {Path} from "../Path"

export class RendererWorker {
    async handle(workerData: IRendererMessage): Promise<any> {
        const path = Path.getAbsolute('js/Infrastructure/worker_renderer.js')
        const worker = new Worker(path, {workerData})
        const [result] = await once(worker, 'message')
        await worker.terminate()
        return result
    }
}
