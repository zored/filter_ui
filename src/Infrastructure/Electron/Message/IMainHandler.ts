import {IntoMainChannel} from "./Channel/IntoMainChannel"
import {IIntoMainMessage} from "./IIntoMainMessage"
import {IntoRendererMessageId} from "./IIntoRendererMessage"

export interface IMainHandler {
    subscribe(): void

    wait(channel: IntoMainChannel, id: IntoRendererMessageId): Promise<IIntoMainMessage>

    done(): Promise<void>
}
