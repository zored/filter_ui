import {IMessage} from "./IMessage"

export interface IMainHandler {
    subscribe(): void

    handle(message: IMessage): void

    done(): Promise<void>
}
