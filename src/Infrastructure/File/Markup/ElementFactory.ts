import {MyFile} from "../MyFile"
import {MyElement} from "./Element/MyElement"

export interface ElementFactory {
    suits(file: MyFile): boolean

    createElement(file: MyFile): MyElement
}
