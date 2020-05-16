import {Timeout} from "./Timeout"

export class Progress {
    private count: number = 0
    private waiting: boolean = false

    constructor(private name: string) {
    }

    increment(): boolean {
        return this.add(+1)
    }

    decrement(): boolean {
        return this.add(-1)
    }

    async done(): Promise<void> {
        this.waiting = true
        console.log(`waiting "${this.name}" started`)
        while (this.count > 0) {
            await Timeout.promise(1000)
            console.log(`waiting "${this.name}": ${this.count}`)
        }
        console.log(`waiting "${this.name}" done`)
        this.waiting = false
    }

    wrapFunc<T>(f: () => T): T {
        this.increment()
        const result = f()
        this.decrement()
        return result
    }

    async wrapPromise<T>(promise: Promise<T>): Promise<T | null> {
        if (!this.increment()) {
            return Promise.reject("progress is busy")
        }

        try {
            return await promise
        } finally {
            this.decrement()
        }

        return null
    }

    private add(delta: number): boolean {
        if (this.waiting && delta > 0) {
            return false
        }
        this.count += delta
        console.log(`progress "${this.name}" +(${delta}) = ${this.count}`)
        return true
    }
}
