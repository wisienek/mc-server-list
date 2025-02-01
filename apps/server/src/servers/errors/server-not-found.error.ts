import {NotFoundException} from '@nestjs/common';

export class ServerNotFoundError extends NotFoundException {
    constructor(hostname?: string, port?: number, ip?: string) {
        super(
            `Server with provided configuration was not found: ${JSON.stringify({
                hostname,
                port,
                ip,
            })}`,
        );
    }
}
