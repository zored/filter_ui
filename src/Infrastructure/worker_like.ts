import {parentPort, workerData} from 'worker_threads'
import {FileLiker} from "./File/Like/FileLiker"

(async () => {
    parentPort.postMessage(await new FileLiker().heavyLike(workerData))
})()
