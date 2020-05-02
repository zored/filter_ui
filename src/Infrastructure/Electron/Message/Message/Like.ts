import {Channel} from "../Channel"
import {IMessage} from "../IMessage"

export class Like implements IMessage{
    channel = Channel.like

    constructor(public like: boolean = true) {
    }
}
