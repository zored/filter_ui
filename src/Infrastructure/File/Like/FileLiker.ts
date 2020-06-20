import {LikeMessage} from "../../Electron/Message/Message/Renderer/LikeMessage"
import {FileSystem} from "../FileSystem/FileSystem"
import {ImageRotator} from "../Image/ImageRotator"
import {CommandId} from "../Timeline/Command/CommandId"
import {RotateCommand} from "../Timeline/Command/RotateCommand"

export type LikeResult = string | null

export class FileLiker {
    private readonly fs = new FileSystem()
    private readonly imageRotator = new ImageRotator(this.fs)

    async like(message: LikeMessage): Promise<LikeResult> {
        try {
            await this.fs.movePromise(message.fileFrom, message.fileTo, message.copy)
            for (const command of message.commands) {
                switch (command.id) {
                    case CommandId.rotate90:
                        const rotateCommand = command as RotateCommand
                        await this.imageRotator.rotate90(message.fileTo, rotateCommand.count90)
                        break
                }
            }
        } catch (e) {
            return e + ''
        }
        return null
    }
}
