import {AddRotate, MyElement} from "../../../File/Markup/MyElement"

type BodyClass = 'like' | 'dislike' | ''

export class Output {
    doRotate?: AddRotate
    private readonly body = document.body
    private readonly done = document.getElementById("done")
    private readonly content = document.getElementById("item")
    private readonly info = document.getElementById("info")
    private readonly loading = document.getElementById("loading")
    private videoSpeed = 1.2
    private videoSpeedDelta = 0.15

    activateContent(enabled: boolean = true) {
        this.setVisible(this.content, enabled)
        this.setVisible(this.done, !enabled)
    }

    like(like: boolean): void {
        this.dispose()
        this.setBodyClass(like ? 'like' : 'dislike')
    }

    addVideoSpeed(multiplier: number): void {
        this.videoSpeed += this.videoSpeedDelta * multiplier
    }

    setContent(element?: MyElement) {
        this.content.innerHTML = ''
        if (element === null) {
            return
        }
        this.content.appendChild(element.html)
        this.doRotate = element.rotate
        this.updateVideoSpeed()
    }

    setInfo(text: string): void {
        this.info.innerText = text
    }

    rotateElement(num90: number): boolean {
        if (!this.doRotate) {
            return false
        }
        this.doRotate(num90 * 90)
        return true
    }

    setLoading(loading = true): void {
        this.setVisible(this.loading, loading)
    }

    async setLoadingPromise<T>(promise: Promise<T>): Promise<T> {
        this.setLoading(true)
        const result = await promise
        this.setLoading(false)
        return result
    }

    private setVisible(element: HTMLElement, visible: boolean): void {
        element.style.display = visible ? 'grid' : 'none'
    }

    private setBodyClass(value: BodyClass): void {
        this.body.className = value
    }

    private dispose(): void {
        this.findVideos().forEach(video => {
            video.pause()
            Array.from(video.getElementsByTagName('source')).forEach(source => {
                source.removeAttribute('src')
            })
            video.load()
        })
        this.setContent(null)
    }

    private updateVideoSpeed() {
        this.findVideos().forEach(video => video.playbackRate = this.videoSpeed)
    }

    private findVideos() {
        return Array.from(document.getElementsByTagName('video'))
    }
}
