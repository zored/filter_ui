export class Timeout {
    public static promise(ms: number): Promise<void> {
        return new Promise<void>(
            resolve => setTimeout(resolve, ms)
        )
    }

    static async wait(f: () => Promise<boolean>, timeoutMs: number = 10000, intervalMs: number = 500) {
        const t = () => new Date().getTime()
        const start = t()

        while (true) {
            if (t() - start > timeoutMs) {
                return false
            }
            if (await f()) {
                return true
            }
            await Timeout.promise(intervalMs)
        }
    }
}
