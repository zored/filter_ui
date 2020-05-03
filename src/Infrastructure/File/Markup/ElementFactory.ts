import {MyFile} from "../MyFile"
import {MyElement} from "./MyElement"

export interface ElementFactory {
    suits(file: MyFile): boolean

    createElement(file: MyFile): MyElement
}
