import {hashAttribute} from "../../../File/Markup/CacheFactory"
import {AddRotate, MyElement} from "../../../File/Markup/Element/MyElement"

type BodyClass = 'like' | 'dislike' | ''

const opacityVisible = '1.0'

const byId = (id: string) => document.getElementById(id)

export interface AllProgress {
    likes: number,
    dislikes: number,
    remaining: number,
}

export class Output {
    doRotate?: AddRotate
    public beforeDispose: (e: HTMLElement) => void
    private readonly body = document.body
    private readonly done = byId("done")
    private readonly content = byId("item")
    private readonly info = byId("info")
    private readonly loading = byId("loading")
    private readonly processingProgress = byId("progress")
    private readonly allProgress: Record<string, HTMLElement> = {
        likes: byId('all_likes'),
        dislikes: byId('all_dislikes'),
        remaining: byId('all_remaining'),
    }
    private videoSpeed = 1.2
    private videoSpeedDelta = 0.15
    private element?: MyElement

    activateContent(enabled: boolean = true) {
        this.setVisible(this.content, enabled)
        this.setVisible(this.done, !enabled)
    }

    setProcessingProgress = (n: number) => {
        this.setVisible(this.processingProgress, n > 0)
        this.processingProgress.innerText = `${n} in progress...`
    }

    setTotalProgress = (p: AllProgress) => {
        console.log(p)
        const total = Object.values(p).reduce((a, v) => a + v, 0)
        Object.keys(p).forEach(
            (k: keyof AllProgress) => {
                const element = this.allProgress[k]
                const v = p[k]
                element.style.width = `${v * 100 / total - 0.01}%`
                element.title = `${v} out of ${total}`
            }
        )
    }

    like = (like: boolean) => {
        this.dispose()
        this.setBodyClass(like ? 'like' : 'dislike')
    }

    addVideoSpeed(multiplier: number): void {
        this.videoSpeed += this.videoSpeedDelta * multiplier
        this.updateVideoSpeed()
    }

    setContent(current?: MyElement, upcoming: MyElement[] = []) {
        upcoming
            .filter(({html}) => this.findExisting(html) === null)
            .forEach(({html}) => this.content.appendChild(
                this.setOpaque(html, true)
            ))
        if (this.element) {
            this.element.onHide()
            this.content.removeChild(this.element.html)
        }
        this.element = current
        if (current === null) {
            return
        }

        const existingHtml = this.findExisting(current.html)
        if (existingHtml === null) {
            this.content.appendChild(current.html)
        } else {
            current.html = existingHtml
        }
        this.setOpaque(current.html, false)
        this.doRotate = current.rotate
        this.updateVideoSpeed()
        current.onShow()
    }


    setInfo(text: string): void {
        this.setVisible(this.info, text.length > 0)
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

    private findExisting(element: HTMLElement) {
        const hash = element.getAttribute(hashAttribute)
        return hash
            ? this.content.querySelector(`[${hashAttribute}='${hash}']`) as HTMLElement | null
            : null
    }

    private setVisible(element: HTMLElement, visible: boolean): void {
        element.style.display = visible ? 'grid' : 'none'
    }

    private setOpaque<T extends HTMLElement>(element: T, opaque: boolean): T {
        element.style.opacity = opaque ? '0.0' : opacityVisible
        return element
    }

    private setBodyClass(value: BodyClass): void {
        this.body.className = value
    }

    private dispose = () => {
        this
            .visibleVideos()
            .forEach(video => {
                video.pause()
                Array
                    .from(video.getElementsByTagName('source'))
                    .forEach(source => source.removeAttribute('src'))
                video.load()
            })
        if (this.element) {
            this.beforeDispose(this.element.html)
        }
        this.setContent(null)
    }

    private updateVideoSpeed = () =>
        this
            .videos()
            .forEach(video => video.playbackRate = this.videoSpeed)

    private videos = () =>
        Array.from(document.getElementsByTagName('video'))

    private visibleVideos = () =>
        this.videos().filter(e => this.notOpaque(e))

    private notOpaque = (c: HTMLElement) => c.style.opacity === opacityVisible
}
