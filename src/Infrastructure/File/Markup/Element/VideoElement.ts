import {MyElement} from "./MyElement"

export class VideoElement extends MyElement {
    onShow() {
        super.onShow()
        // noinspection JSIgnoredPromiseFromCall
        this.video().play()
    }

    onHide() {
        this.video().pause()
    }

    private video = () => this.html as HTMLVideoElement
}
