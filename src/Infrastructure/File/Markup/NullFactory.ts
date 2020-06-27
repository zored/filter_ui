import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {MyElement} from "./Element/MyElement"

export class NullFactory implements ElementFactory {
    createElement(file: MyFile): MyElement {
        const div = document.createElement('div')
        div.innerText = `No parser found for ${JSON.stringify(file.path)}`
        return new MyElement(div)
    }

    suits(_: MyFile): boolean {
        return true
    }
}
