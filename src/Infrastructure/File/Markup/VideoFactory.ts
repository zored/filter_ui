import {MyFile} from "../MyFile"
import {MyElement} from "./Element/MyElement"
import {VideoElement} from "./Element/VideoElement"
import {ElementFactory} from "./ElementFactory"

export class VideoFactory implements ElementFactory {
    createElement(file: MyFile): MyElement {
        const video = document.createElement('video')
        video.autoplay = false
        video.loop = true
        video.controls = true
        video.muted = false
        video.preload = 'auto'
        video.classList.add('video-player')
        video.style.display = 'block'
        video.style.width = '100%'
        video.style.height = '100%'
        video.style.objectFit = 'contain'
        video.style.filter = 'none'
        video.appendChild(this.createSource(file.path))
        return new VideoElement(video)
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
