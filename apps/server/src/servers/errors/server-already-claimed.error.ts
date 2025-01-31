import {ConflictException} from '@nestjs/common';

export class ServerAlreadyClaimedError extends ConflictException {
    constructor() {
        super(
            `Server already claimed by someone else, contact administrator to reclaim it or wait a week after grace period to claim it.`,
        );
    }
}
