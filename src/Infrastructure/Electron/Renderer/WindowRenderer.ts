import {ISubjectActions} from "../../../Domain/ISubjectActions"
import {SubjectActions} from "../../Domain/SubjectActions"
import {SubjectOptions} from "../../Domain/SubjectOptions"
import {WindowSubscriber} from "./Events/WindowSubscriber"
import {KeyboardSubscriber} from "./Input/KeyboardSubscriber"
import {Output} from "./Output/Output"

export class WindowRenderer {
    public static async run(): Promise<void> {
        const output = new Output()
        const subject = await this.createFilledSubject(output)
        this.subscribeKeyboard(subject, output)
    }

    private static subscribeKeyboard(subject: ISubjectActions, output: Output) {
        const options = new SubjectOptions(output)
        this.subscribe(subject, options)
    }

    private static subscribe(subject: ISubjectActions, options: SubjectOptions) {
        new WindowSubscriber(subject).subscribe()
        new KeyboardSubscriber(subject, options).subscribe()
    }

    private static async createFilledSubject(output: Output): Promise<ISubjectActions> {
        const subject = new SubjectActions(output)
        await subject.load()
        return subject
    }
}
