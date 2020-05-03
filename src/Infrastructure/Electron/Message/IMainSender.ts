import {IIntoRendererMessage} from "./IIntoRendererMessage"

export interface IMainSender {
    sendToRenderer(message: IIntoRendererMessage): void
}
