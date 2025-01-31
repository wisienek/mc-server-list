import {ConflictException} from '@nestjs/common';

export class ServerExistsError extends ConflictException {
    constructor(verificationCode: string) {
        super(
            `Server already exists!${
                verificationCode
                    ? `(type: ${verificationCode} into MOTD to verify and try again)`
                    : ''
            }`,
        );
    }
}
