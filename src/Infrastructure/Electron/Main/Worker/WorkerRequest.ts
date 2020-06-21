import {IRendererMessage} from "../../Message/Message/IRendererMessage"

export type RequestId = number;
export class WorkerRequest {
    constructor(
        public id: RequestId,
        public message: IRendererMessage,
    ) {
    }
}
