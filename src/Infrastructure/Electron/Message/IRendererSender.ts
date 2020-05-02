import {IMessage} from "./IMessage"

export interface IRendererSender {
    sendToMain(message: IMessage): void
}
