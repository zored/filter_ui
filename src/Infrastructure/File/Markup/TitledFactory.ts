import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"

export class TitledFactory implements ElementFactory {
    constructor(private factory: ElementFactory) {
    }

    createElement(file: MyFile): HTMLElement {
        return document.createElement('div')
            .appendChild(this.createHeader(file))
            .appendChild(this.factory.createElement(file))
    }

    suits(file: MyFile): boolean {
        return true
    }

    private createHeader(file: MyFile) {
        const header = document.createElement('h2')
        header.innerText = file.path
        return header
    }

}
