import {Timeout} from "./Timeout"

export class Promises {
    static map = <A, T>(a: Array<A>, f: (a: A, i: number) => Promise<T>): Promise<T[]> => {
        const acc: T[] = []
        return a.reduce(
            (p, v, i) => p.then((t) => {
                acc.push(t)
                return f(v, i)
            }),
            Promise.resolve(undefined)
        ).then(t => {
            acc.push(t)
            return acc.slice(1)
        })
    }

    static createLock = (size: number) => {
        let busy = 0
        return async <T>(f: () => Promise<T>): Promise<T> => {
            while (busy >= size) {
                await Timeout.promise(500)
            }
            busy++
            try {
                return await f()
            } finally {
                busy--
            }
        }
    }
}
