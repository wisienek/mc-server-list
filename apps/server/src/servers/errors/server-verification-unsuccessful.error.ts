import {BadRequestException} from '@nestjs/common';

export class ServerVerificationUnsuccessfulError extends BadRequestException {
    constructor() {
        super(
            `Server Verification Unsuccessful! Either code expired or it's invalid! If both time and code are correct please check in a few minutes`,
        );
    }
}
