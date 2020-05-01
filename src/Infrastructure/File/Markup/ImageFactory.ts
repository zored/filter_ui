import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"

export class ImageFactory implements ElementFactory {
    createElement(file: MyFile): HTMLElement {
        const img = document.createElement('img')
        img.src = file.path
        return img
    }

    suits(file: MyFile): boolean {
        return file.path.match(/\.(jpe?g|png)$/i) !== null
    }
}
