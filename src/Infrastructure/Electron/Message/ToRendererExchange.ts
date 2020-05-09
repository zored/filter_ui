import {IntoMainChannel} from "./Channel/IntoMainChannel"
import {IIntoMainMessage} from "./IIntoMainMessage"
import {IIntoRendererMessage} from "./IIntoRendererMessage"
import {IMainHandler} from "./IMainHandler"
import {IMainSender} from "./IMainSender"

export class ToRendererExchange {
    constructor(private sender: IMainSender, private handler: IMainHandler) {
    }

    async exchange(message: IIntoRendererMessage, receiveChannel: IntoMainChannel): Promise<IIntoMainMessage> {
        this.sender.sendToRenderer(message)
        return await this.handler.wait(receiveChannel, message.id)
    }
}
