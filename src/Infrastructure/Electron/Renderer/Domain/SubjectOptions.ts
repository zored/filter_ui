import {ISubjectOptions} from "../../../../Domain/ISubjectOptions"
import {Output} from "../Output/Output"

export class SubjectOptions implements ISubjectOptions {
    constructor(private output: Output) {
    }

    addVideoSpeed(delta: number): void {
        this.output.addVideoSpeed(delta)
    }
}
