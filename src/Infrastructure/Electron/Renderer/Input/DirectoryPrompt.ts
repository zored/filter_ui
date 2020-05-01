import {remote} from "electron"
import OpenDialogOptions = Electron.OpenDialogOptions

export class DirectoryPrompt {
    private readonly options: OpenDialogOptions = {
        properties: ['openDirectory', "multiSelections"],
    }

    public async getDirectories(): Promise<string[]> {
        const window = remote.getCurrentWindow()
        const result = await remote.dialog.showOpenDialog(window, this.options)
        return result.filePaths || []
    }
}
