import {Timeout} from "./Timeout"

export type RequestId = number;

export type RequestEvent<Event> = (doRequest: (id: RequestId) => void) => Promise<Event>

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

    static forEvents = <Event>(getId: (e: Event) => RequestId) => {
        const resolves: Record<RequestId, (e: Event) => void> = {}
        const listener = (e: Event) => {
            const id = getId(e)
            const resolve = resolves[id]
            if (!resolve) {
                return
            }
            resolve(e)
        }

        let nextId = 1
        const request: RequestEvent<Event> = (doRequest: (id: RequestId) => void) =>
            new Promise<Event>(resolve => {
                const id = nextId++
                resolves[id] = resolve
                doRequest(id)
            })

        return {listener, request}
    }
}
