export class Timeout {
    public static promise(ms: number): Promise<void> {
        return new Promise<void>(
            resolve => setTimeout(resolve, ms)
        )
    }
}
