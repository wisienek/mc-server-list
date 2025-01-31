import {BadRequestException} from '@nestjs/common';

export class ServerVerificationOfflineError extends BadRequestException {
    constructor() {
        super(`Server must be online to verify!`);
    }
}
