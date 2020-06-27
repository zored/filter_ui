import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {AddRotate, MyElement} from "./Element/MyElement"

export class ImageFactory implements ElementFactory {
    createElement(file: MyFile): MyElement {
        return new MyElement(this.createImage(file), this.getRotate(file))
    }

    private createImage = (file: MyFile) => {
        const img = document.createElement('img')
        img.src = `${file.path}#${new Date().getTime()}`
        return img
    }

    suits = (file: MyFile): boolean =>
        this.getExt(file) !== undefined

    private getRotate = (file: MyFile) =>
        this.getExt(file) === 'gif'
            ? undefined
            : this.getAddRotate

    private getExt = (file: MyFile) =>
        (file.path.match(/\.(jpe?g|png|gif)$/i) || [])[1]

    private getAddRotate(img: HTMLImageElement): AddRotate {
        let deg: number = 0
        return deltaDeg => img.style.transform = `rotate(${deg += deltaDeg}deg)`
    }
}
