import {PassportSerializer} from '@nestjs/passport';
import {Inject} from '@nestjs/common';
import {User} from '@backend/db';
import type {Done, IAuthService} from './interfaces';

export class SessionSerializer extends PassportSerializer {
    constructor(@Inject('AUTH_SERVICE') private readonly authService: IAuthService) {
        super();
    }

    serializeUser(user: User, done: Done): void {
        done(null, user);
    }

    async deserializeUser(user: User, done: Done): Promise<void> {
        const userDB = await this.authService.findUser({
            discordId: user.discordId,
        });

        return userDB ? done(null, userDB) : done(null, null);
    }
}
