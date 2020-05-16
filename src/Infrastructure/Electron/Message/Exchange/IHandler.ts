export interface IHandler<ThatChannel, MessageId, ThatMessage> {
    subscribe(): void

    waitResponse(
        channel: ThatChannel,
        inResponseToId: MessageId
    ): Promise<ThatMessage>

    handle(message: ThatMessage): void
}
