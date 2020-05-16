import {parentPort, workerData} from "worker_threads"
import {FileLiker} from "../../../File/Like/FileLiker"
import {FileRetriever} from "../../../File/Retriever/FileRetriever"
import {RendererChannel} from "../../Message/Channel/RendererChannel"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {GetFilesMessage} from "../../Message/Message/Renderer/GetFilesMessage"
import {LikeMessage} from "../../Message/Message/Renderer/LikeMessage"
import {WorkerMessage} from "./WorkerMessage"

export class WorkerApp {
    private fileRetriever = new FileRetriever(false, info => this.sendInfo(info))
    private liker = new FileLiker()

    async run(): Promise<void> {
        const data = await this.getData(workerData)
        parentPort.postMessage(new WorkerMessage(data, true))
    }

    private sendInfo(info: string): void {
        parentPort.postMessage(new WorkerMessage(null, false, info))
    }

    private async getData(message: IRendererMessage) {
        switch (message.channel) {
            case RendererChannel.like:
                return this.liker.like(message as LikeMessage)
            case RendererChannel.getFiles:
                return this.fileRetriever.getFilesMessage(message as GetFilesMessage)
            default:
                throw new Error(`Worker doesn't support message ${message.channel}`)
        }
    }
}
