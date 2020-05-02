import {IMessage} from "./IMessage"

export interface IRendererSender {
    send(message: IMessage): void
}
