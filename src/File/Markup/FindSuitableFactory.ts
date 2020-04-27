import {MyFile} from "../MyFile";
import {ElementFactory} from "./ElementFactory";
import {ImageFactory} from "./ImageFactory";
import {NullFactory} from "./NullFactory";
import {VideoFactory} from "./VideoFactory";

export class FindSuitableFactory implements ElementFactory {
    private factories: ElementFactory[] = [
        new ImageFactory(),
        new VideoFactory(),
        new NullFactory(),
    ];

    createElement(file: MyFile): HTMLElement {
        return this.factories.find(factory => factory.suits(file)).createElement(file);
    }

    suits(file: MyFile): boolean {
        return true;
    }

}
