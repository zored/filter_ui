import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {AddRotate, MyElement} from "./Element/MyElement"

export class ImageFactory implements ElementFactory {
    createElement(file: MyFile): MyElement {
        const img = document.createElement('img')
        img.src = `${file.path}#${new Date().getTime()}`

        return new MyElement(img, this.getRotate(img))
    }

    suits(file: MyFile): boolean {
        return file.path.match(/\.(jpe?g|png)$/i) !== null
    }

    private getRotate(img: HTMLImageElement): AddRotate {
        let deg: number = 0
        return deltaDeg => img.style.transform = `rotate(${deg += deltaDeg}deg)`
    }
}
