import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"

export class NullFactory implements ElementFactory {
    createElement(file: MyFile): HTMLElement {
        const div = document.createElement('div')
        div.innerText = `No parser found for ${file}`
        return div
    }

    suits(file: MyFile): boolean {
        return true
    }

}
