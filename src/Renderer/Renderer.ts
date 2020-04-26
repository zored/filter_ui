import {remote} from "electron";
import * as fs from "fs";
import * as path from "path";

type FullPath = string
type CreatedAtMs = number;
type File = [FullPath, CreatedAtMs];
type FileStack = File[];
type Before = File;
type After = File;
type BodyClass = 'like' | 'dislike' | ''
type Like = boolean

export class Renderer {
    private files: FileStack;
    private file: File | null;
    private history: [Before, After, Like][] = [];
    private videoSpeed = 1.2;
    private videoSpeedDelta = 0.15;

    public static start(): void {
        new Renderer().run();
    }

    private next(): void {
        this.file = this.files.shift() || null;
        if (this.file != null) {
            this.showFile();
            return;
        }
        if (this.files.length > 0) {
            this.next();
        }
        this.setDone(true);
    }

    private getItem(): HTMLElement {
        return document.getElementById("item");
    }

    private getBody(): HTMLElement {
        return document.body;
    }

    private getDone(): HTMLElement {
        return document.getElementById("done");
    }

    private async run(): Promise<void> {
        document.addEventListener('keyup', (event) => {
            switch (event.code) {
                case 'KeyF':
                    this.setLike(false);
                    break;
                case 'KeyJ':
                    this.setLike(true);
                    break;

                case 'KeyD':
                    this.updateVideoSpeed(this.videoSpeed - this.videoSpeedDelta);
                    break;
                case 'KeyK':
                    this.updateVideoSpeed(this.videoSpeed + this.videoSpeedDelta);
                    break;

                case 'KeyL':
                    this.undo();
                    break;
                case 'KeyS':
                    this.showFile();
                    break;
                default:
                    return;
            }

            event.preventDefault();
        });

        this.files = (await this.promptDirectories())
            .flatMap(directory => this.getFiles(directory))
            .sort((left, right) => left[1] - right[1]);
        this.setVisible(this.getItem(), true);
        this.next();
    }

    private setDone(done: boolean): void {
        this.setBodyClass('');
        this.setVisible(this.getItem(), !done);
        this.setVisible(this.getDone(), done);
    }

    private setVisible(element: HTMLElement, visible: boolean): void {
        element.style.display = visible ? 'block' : 'none';
    }

    private async promptDirectories(): Promise<string[]> {
        return (await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openDirectory', "multiSelections"],
        })).filePaths || [];
    }

    private getFiles(dir: string): FileStack {
        return fs.readdirSync(dir).flatMap((relative): File[] => {
            const path = dir + '/' + relative;
            const stats = fs.lstatSync(path);
            let isDirectory = stats.isDirectory();
            if (!isDirectory) {
                let createdAt = stats.mtimeMs;

                const matches = path.match(/(\d{4}-\d{2}-\d{2}) (\d{3})/);
                if (matches) {
                    const [, date, version] = matches;
                    createdAt = (Date.parse(date) * 1000 + parseInt(version)) / 1000;
                }
                const file: File = [path, createdAt];
                return [file];
            }
            if (!this.isRecursive()) {
                return [];
            }
            return this.getFiles(path);
        });
    }

    private getFileHtml(file: string): string | null {
        const serializers: [RegExp, () => string][] = [
            [/\.(jpe?g|png)$/i, () => `<img title="${file}" alt="${file}" src="${file}"/>`],
            [/\.(mov|mp4|m4v)$/i, () => `
                <video autoplay>
                    <source src="${file}" type="video/mp4">
                </video>
            `],
        ];

        const serializer = serializers.find(([pattern]) => file.match(pattern));
        if (!serializer) {
            return null;
        }

        const content = serializer[1]();
        return `<div class="file"><h2>${file}</h2>${content}</div>`;
    }

    private isRecursive(): boolean {
        return false;
    }

    private setLike(like: boolean): void {
        const file = this.file;
        if (!file) {
            return;
        }
        this.dispose();
        this.setBodyClass(like ? 'like' : 'dislike');

        const filePath = file[0];
        const fileCreatedAt = file[1];
        const directory = path.join(
            path.dirname(filePath),
            (like ? 'like' : 'dislike'),
        );
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory);
        }
        const fileAfter: After = [path.join(
            directory,
            path.basename(filePath),
        ), fileCreatedAt];

        const fileAfterPath = fileAfter[0];
        fs.copyFile(filePath, fileAfterPath, () => {
            const timeout = 500;
            const remove = (retry = 0) => fs.unlink(filePath, err => {
                if (err === null) {
                    return;
                }
                if (err.code != "EBUSY" || retry > 5) {
                    throw err;
                }
                console.log('retry');
                setTimeout(() => remove(retry + 1), timeout);
            });
            setTimeout(() => remove(), timeout);
        });
        this.history.push([file, fileAfter, like]);

        this.next();
    }

    private setBodyClass(value: BodyClass): void {
        this.getBody().className = value;
    }

    private undo(): void {
        const item = this.history.pop();
        if (!item) {
            return;
        }
        this.setDone(false);
        const [before, after] = item;
        const afterPath = after[0];
        const beforePath = before[0];
        fs.copyFileSync(afterPath, beforePath);
        fs.unlinkSync(afterPath);

        this.files.unshift(this.file);
        this.file = before;
        this.showFile();
    }

    private setItemHtml(html: string): void {
        this.getItem().innerHTML = html;
        this.updateVideoSpeed(null);
    }

    private updateVideoSpeed(videoSpeed: number | null) {
        if (videoSpeed > 0) {
            this.videoSpeed = videoSpeed;
        }
        this.getVideos().forEach(video => video.playbackRate = this.videoSpeed);
    }

    private dispose(): void {
        this.getVideos().forEach(video => {
            video.pause();
            Array.from(video.getElementsByTagName('source')).forEach(source => {
                source.removeAttribute('src');
            });
            video.load();
        });
        this.setItemHtml('');
    }

    private getVideos() {
        return Array.from(document.getElementsByTagName('video'));
    }

    private showFile(): void {
        const filePath = this.file[0];
        this.setItemHtml(this.getFileHtml(filePath));
    }
}
