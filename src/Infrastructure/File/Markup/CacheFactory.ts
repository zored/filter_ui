import * as objectHash from 'object-hash'
import {MyFile} from "../MyFile"
import {MyElement} from "./Element/MyElement"
import {ElementFactory} from "./ElementFactory"


export const hashAttribute = 'data-hash'
type Hash = string

export class CacheFactory implements ElementFactory {
    private elementQueue: [Hash, MyElement][] = []

    constructor(private factory: ElementFactory) {
    }

    createElement(file: MyFile): MyElement {
        const hash = this.hash(file)
        const oldElement = this.elementByHash(hash)
        if (oldElement) {
            return oldElement
        }

        const newElement = this.createNewElement(file, hash)
        this.elementQueue.push([hash, newElement])
        while (this.elementQueue.length > 10) {
            this.elementQueue.shift()
        }

        return newElement
    }

    suits = (file: MyFile) => this.factory.suits(file)

    dispose(e: HTMLElement): void {
        const hash = e.getAttribute(hashAttribute)
        this.elementQueue = this.elementQueue.filter(([h]) => h !== hash)
    }

    private elementByHash = (hash: string) =>
        (this.elementQueue.find(([h]) => h === hash) || [])[1]

    private createNewElement = (file: MyFile, hash: string): MyElement => {
        const element = this.factory.createElement(file)
        element.html.setAttribute(hashAttribute, hash)
        return element
    }

    private hash = (file: MyFile): Hash => objectHash.MD5(file)
}
