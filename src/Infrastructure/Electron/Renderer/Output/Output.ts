type BodyClass = 'like' | 'dislike' | ''

export class Output {
    private readonly body = document.body
    private readonly done = document.getElementById("done")
    private readonly content = document.getElementById("item")

    private videoSpeed = 1.2
    private videoSpeedDelta = 0.15

    activateContent(enabled: boolean = true) {
        this.setVisible(this.content, enabled)
        this.setVisible(this.done, !enabled)
        if (!enabled) {
            this.setBodyClass('')
        }
    }

    like(like: boolean): void {
        this.dispose()
        this.setBodyClass(like ? 'like' : 'dislike')
    }

    addVideoSpeed(multiplier: number): void {
        this.videoSpeed += this.videoSpeedDelta * multiplier
    }

    setContent(element: HTMLElement = null) {
        this.content.innerHTML = ''
        if (element === null) {
            return
        }
        this.content.appendChild(element)
        this.updateVideoSpeed()
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
