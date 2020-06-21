import {MyFile} from "../MyFile"
import {MyElement} from "./Element/MyElement"
import {ElementFactory} from "./ElementFactory"
import {FindSuitableFactory} from "./FindSuitableFactory"

export class TitledFactory implements ElementFactory {
    constructor(private factory: ElementFactory = new FindSuitableFactory()) {
    }

    createElement(file: MyFile): MyElement {
        const child = this.factory.createElement(file)
        const htmlElement = document.createElement('div')
            .appendChild(this.createHeader(file))
            .appendChild(child.html)
        return child.withHtml(htmlElement)
    }

    suits(_: MyFile): boolean {
        return true
    }

    private createHeader(file: MyFile) {
        const header = document.createElement('h2')
        header.innerText = file.path
        return header
    }

}
