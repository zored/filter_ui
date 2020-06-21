import {RequestId} from "./WorkerRequest"

export class WorkerResponse {
    constructor(
        public requestId: RequestId,
        public data: any,
        public info?: string
    ) {
    }
}
