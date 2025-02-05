import {ApiConfig, DiscordConfig, getConfigs} from '@backend/config';
import {DiscordOAuth2Credentials, Session, User} from '@backend/db';
import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DiscordAuthService} from './discord-auth.service';
import {SessionSerializer} from './session.serializer';
import {DiscordStrategy} from './strategies';

const authProvider = {
    provide: 'AUTH_SERVICE',
    useClass: DiscordAuthService,
};

@Module({
    imports: [
        TypeOrmModule.forFeature([User, DiscordOAuth2Credentials, Session]),
        ...getConfigs(ApiConfig, DiscordConfig),
    ],
    providers: [authProvider, DiscordStrategy, SessionSerializer],
    exports: [authProvider],
})
export class DiscordAuthModule {}
