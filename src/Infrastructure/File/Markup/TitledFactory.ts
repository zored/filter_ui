import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {FindSuitableFactory} from "./FindSuitableFactory"
import {MyElement} from "./Element/MyElement"

export class TitledFactory implements ElementFactory {
    constructor(private factory: ElementFactory = new FindSuitableFactory()) {
    }

    createElement(file: MyFile): MyElement {
        const child = this.factory.createElement(file)
        const htmlElement = document.createElement('div')
            .appendChild(this.createHeader(file))
            .appendChild(child.html)

        return new MyElement(htmlElement, child.rotate)
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
