import {ForbiddenException} from '@nestjs/common';

export class ServerNotOwnedByUserError extends ForbiddenException {
    constructor(hostName: string, userId: string) {
        super(`Server: ${hostName} is not owned by user with id: ${userId}`);
    }
}
