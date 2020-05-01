import {MyFile} from "../MyFile"

export interface ElementFactory {
    suits(file: MyFile): boolean

    createElement(file: MyFile): HTMLElement
}
