import {parentPort, workerData} from 'worker_threads'
import {RendererChannel} from "./Electron/Message/Channel/RendererChannel"
import {IRendererMessage} from "./Electron/Message/Message/IRendererMessage"
import {FileLiker} from "./File/Like/FileLiker"
import {DirectoryFileRetriever} from "./File/Retriever/DirectoryFileRetriever"

(async () => {
    const message: IRendererMessage = workerData
    parentPort.postMessage(await ((): Promise<any> => {
        switch (message.channel) {
            case RendererChannel.like:
                return new FileLiker().heavyLike(workerData)
            case RendererChannel.getFiles:
                return new DirectoryFileRetriever(false).getFilesMessage(workerData)
        }
    })())
})()
