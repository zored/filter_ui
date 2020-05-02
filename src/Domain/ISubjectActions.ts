/**
 * The things we can do with subject (image, video, etc.)
 */
export interface ISubjectActions {
    like(): Promise<void>

    dislike(): Promise<void>

    undo(): Promise<void>

    refresh(): void

    /**
     * Load all subjects to rate.
     */
    load(): Promise<void>;

    done(): Promise<void>

    rotate(num90: number): Promise<void>
}
