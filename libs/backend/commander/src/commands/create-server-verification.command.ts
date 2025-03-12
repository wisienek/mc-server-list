import type {ICommand} from '@nestjs/cqrs';

export class CreateServerVerificationCommand implements ICommand {
    constructor(public readonly serverId: string, public userId: string) {}
}
