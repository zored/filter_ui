import {MyElement} from "./MyElement"

export class VideoElement extends MyElement {
    constructor(private e: HTMLVideoElement) {
        super(e);
    }
    onShow() {
        super.onShow()
        // noinspection JSIgnoredPromiseFromCall
        this.e.play()
    }
    onHide() {
        this.e.pause()
    }
}
