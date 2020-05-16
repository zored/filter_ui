import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {ImageFactory} from "./ImageFactory"
import {MyElement} from "./MyElement"
import {NullFactory} from "./NullFactory"
import {VideoFactory} from "./VideoFactory"

export class FindSuitableFactory implements ElementFactory {
    private factories: ElementFactory[] = [
        new ImageFactory(),
        new VideoFactory(),
        new NullFactory(),
    ]

    createElement(file: MyFile): MyElement {
        return this.factories.find(factory => factory.suits(file)).createElement(file)
    }

    suits(_: MyFile): boolean {
        return true
    }

}
