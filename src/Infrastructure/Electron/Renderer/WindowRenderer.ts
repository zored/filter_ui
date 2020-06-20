import {ISubjectActions} from "../../../Domain/ISubjectActions"
import {Source} from "../../../Domain/Source"
import {SubjectActions} from "./Domain/SubjectActions"
import {SubjectOptions} from "./Domain/SubjectOptions"
import {WindowSubscriber} from "./Events/WindowSubscriber"
import {KeyboardSubscriber} from "./Input/KeyboardSubscriber"
import {Output} from "./Output/Output"

export class WindowRenderer {
    public static async run(): Promise<void> {
        const output = new Output()
        const subject = await this.createFilledSubject(output, this.getSource())
        this.subscribeKeyboard(subject, output)
    }

    private static getSource(): Source {
        const query = (global as any).location.search as string
        const values = query
            .substring(1)
            .split('&')
            .map(p => p.split('='))
            .reduce((a, [name, value]) => {
                a[name] = decodeURIComponent(value)
                return a
            }, {} as Record<string, string>)
        const directory = values.directory
        const copy = values.copy === '1'
        return {directory, copy}
    }

    private static subscribeKeyboard(subject: ISubjectActions, output: Output) {
        const options = new SubjectOptions(output)
        this.subscribe(subject, options)
    }

    private static subscribe(subject: ISubjectActions, options: SubjectOptions) {
        new WindowSubscriber(subject).subscribe()
        new KeyboardSubscriber(subject, options).subscribe()
    }

    private static async createFilledSubject(output: Output, source: Source): Promise<ISubjectActions> {
        const subject = new SubjectActions(output, source)
        await subject.load()
        return subject
    }
}
