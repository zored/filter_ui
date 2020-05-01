import {MyFile} from "../MyFile"
import {ElementFactory} from "./ElementFactory"

export class VideoFactory implements ElementFactory {
    createElement(file: MyFile): HTMLElement {
        const video = document.createElement('video')
        video.appendChild(this.createSource(file.path))
        return video
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
