import {parentPort} from "worker_threads"
import {FileLiker} from "../../../File/Like/FileLiker"
import {FileRetriever} from "../../../File/Retriever/FileRetriever"
import {RendererChannel} from "../../Message/Channel/RendererChannel"
import {IRendererMessage} from "../../Message/Message/IRendererMessage"
import {GetFilesMessage} from "../../Message/Message/Renderer/GetFilesMessage"
import {LikeMessage} from "../../Message/Message/Renderer/LikeMessage"
import {WorkerRequest} from "./WorkerRequest"
import {WorkerResponse} from "./WorkerResponse"

export class WorkerApp {
    private liker = new FileLiker()

    subscribe = () =>
        parentPort.addListener("message", async ({id, message}: WorkerRequest) =>
            parentPort.postMessage(
                new WorkerResponse(
                    id,
                    await this.getData(message)
                )
            )
        )

    private sendInfo = (info: string): void =>
        parentPort.postMessage(new WorkerResponse(0, null, info))

    private fileRetriever = new FileRetriever(false, info => this.sendInfo(info))

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
