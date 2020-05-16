export class WorkerMessage {
    constructor(
        public data: any,
        public final: boolean,
        public info?: string
    ) {
    }
}
