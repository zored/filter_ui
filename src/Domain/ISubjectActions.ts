/**
 * The things we can do with subject (image, video, etc.)
 */
export interface ISubjectActions {
    like(): void

    dislike(): void

    undo(): void

    refresh(): void

    /**
     * Load all subjects to rate.
     */
    load(): Promise<void>;

    done(): Promise<void>
}
