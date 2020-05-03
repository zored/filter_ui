import {IIntoRendererMessage} from "./IIntoRendererMessage"

export interface IRendererHandler {
    subscribe(): void

    handle(message: IIntoRendererMessage): void
}
