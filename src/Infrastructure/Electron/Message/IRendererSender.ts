import {IIntoMainMessage} from "./IIntoMainMessage"

export interface IRendererSender {
    sendToMain(message: IIntoMainMessage): void
}
