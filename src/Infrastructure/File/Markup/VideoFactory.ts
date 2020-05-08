import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"
import {MyElement} from "./MyElement"

export class VideoFactory implements ElementFactory {
    createElement(file: MyFile): MyElement {
        const video = document.createElement('video')
        video.autoplay = true
        video.loop = true
        video.appendChild(this.createSource(file.path))
        return new MyElement(video)
    }

    suits(file: MyFile): boolean {
        return file.path.match(/\.(mov|mp4|m4v)$/i) !== null
    }

    private createSource(path: string) {
        const source = document.createElement('source')
        source.src = path
        source.type = 'video/mp4'
        return source
    }
}
