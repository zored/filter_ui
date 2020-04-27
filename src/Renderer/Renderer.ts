import {remote} from "electron";
import * as fs from "fs";
import {FileSystem} from "../File/FileSystem/FileSystem";
import {ElementFactory} from "../File/Markup/ElementFactory";
import {FindSuitableFactory} from "../File/Markup/FindSuitableFactory";
import {TitledFactory} from "../File/Markup/TitledFactory";
import {MyFile} from "../File/MyFile";
import {Timeline} from "../File/Timeline/Timeline";
import {TimelineFactory} from "../File/Timeline/TimelineFactory";
import {Output} from "./Output/Output";

type FileStack = MyFile[];

export class Renderer {
    private timeline: Timeline;

    private readonly timelineFactory = new TimelineFactory();
    private readonly output = new Output();
    private readonly elementFactory: ElementFactory = new TitledFactory(new FindSuitableFactory());
    private readonly fs = new FileSystem();

    public static start(): void {
        new Renderer().run();
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
                    this.output.addVideoSpeed(+1);
                    break;
                case 'KeyK':
                    this.output.addVideoSpeed(-1);
                    break;

                case 'KeyL':
                    this.undo();
                    break;
                case 'KeyS':
                    this.updateOutput();
                    break;
                default:
                    return;
            }

            event.preventDefault();
        });

        const files = (await this.promptDirectories())
            .flatMap(directory => this.getFiles(directory));

        this.timeline = this.timelineFactory.createFromFiles(files);
        this.output.activateContent(true);
        this.updateOutput();
    }

    private async promptDirectories(): Promise<string[]> {
        return (await remote.dialog.showOpenDialog(remote.getCurrentWindow(), {
            properties: ['openDirectory', "multiSelections"],
        })).filePaths || [];
    }

    private getFiles(dir: string): FileStack {
        return fs.readdirSync(dir).flatMap((relative): MyFile[] => {
            const path = dir + '/' + relative;
            const stats = fs.lstatSync(path);
            let isDirectory = stats.isDirectory();
            if (!isDirectory) {
                return [new MyFile(path, stats)];
            }
            if (!this.isRecursive()) {
                return [];
            }
            return this.getFiles(path);
        });
    }


    private isRecursive(): boolean {
        return false;
    }


    private setLike(like: boolean): void {
        const file = this.timeline.getCurrentFile();
        if (!file) {
            return;
        }
        this.output.like(like);
        const directoryName = like ? 'like' : 'dislike';
        const newPath = this.fs.moveToNeighbourDirectory(file.path, directoryName);
        this.timeline.toHistory(newPath);
        this.updateOutput();
    }

    private undo(): void {
        const item = this.timeline.getPrevious();
        if (item === null) {
            return;
        }
        this.fs.moveSync(item.newPath, item.prevPath);
        this.updateOutput();
    }

    private updateOutput(): void {
        const isComplete = this.timeline.isComplete();
        this.output.activateContent(!isComplete);
        if (isComplete) {
            return;
        }
        const file = this.timeline.getCurrentFile();
        const element = this.elementFactory.createElement(file);
        this.output.setContent(element);
    }
}
