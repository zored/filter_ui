import {IIntoMainMessage} from "./IIntoMainMessage"

export interface IMainHandler {
    subscribe(): void

    handle(message: IIntoMainMessage): void

    done(): Promise<void>
}
