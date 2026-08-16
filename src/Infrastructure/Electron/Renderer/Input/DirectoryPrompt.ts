export class DirectoryPrompt {
    public async getDirectories(): Promise<string[]> {
        return window.filterUi.chooseDirectories()
    }
}
