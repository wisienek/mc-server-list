import {ApiConfig, DiscordConfig, getConfigs} from '@backend/config';
import {DiscordOAuth2Credentials, Session, User, UserCredentials} from '@backend/db';
import {Module, type Provider} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {DiscordAuthService} from './discord-auth.service';
import {SessionSerializer} from './session.serializer';
import {DiscordStrategy, LocalStrategy} from './strategies';

const authProvider = {
    provide: 'AUTH_SERVICE',
    useClass: DiscordAuthService,
};

const strategies: Provider[] = [DiscordStrategy, LocalStrategy];

@Module({
    imports: [
        TypeOrmModule.forFeature([
            User,
            DiscordOAuth2Credentials,
            Session,
            UserCredentials,
        ]),
        ...getConfigs(ApiConfig, DiscordConfig),
    ],
    providers: [authProvider, ...strategies, SessionSerializer],
    exports: [authProvider],
})
export class DiscordAuthModule {}
