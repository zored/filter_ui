import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {MyElement} from "./MyElement"

export class NullFactory implements ElementFactory {
    createElement(file: MyFile): MyElement {
        const div = document.createElement('div')
        div.innerText = `No parser found for ${file}`
        return new MyElement(div)
    }

    suits(_: MyFile): boolean {
        return true
    }

}
