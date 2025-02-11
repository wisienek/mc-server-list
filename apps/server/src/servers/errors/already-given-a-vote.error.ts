import {ConflictException} from '@nestjs/common';

export class AlreadyGivenAVoteError extends ConflictException {
    constructor() {
        super(`Already given a vote to this server!`);
    }
}
