export type AddRotate = (deg: number) => void

export class MyElement {
    constructor(public html: HTMLElement, public rotate: AddRotate = null) {
    }

    onShow(): void {
    }

    onHide(): void {
    }

    withHtml(html: HTMLElement) {
        this.html = html
        return this
    }
}
