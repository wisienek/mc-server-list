import type {ICommand} from '@nestjs/cqrs';

export class VerifyServerCommand implements ICommand {
    constructor(public readonly hostName: string, public readonly userId: string) {}
}
