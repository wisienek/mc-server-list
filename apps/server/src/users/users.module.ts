import {DiscordAuthModule} from '@backend/auth';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Module, type Provider} from '@nestjs/common';
import {DiscordOAuth2Credentials, User, UserCredentials} from '@backend/db';
import {GetUserHandler} from './handlers';
import {UsersController} from './users.controller';
import {UsersService} from './users.service';
import {UserProfile} from './users.profile';

const handlers: Provider[] = [GetUserHandler];

@Module({
    imports: [
        PassportModule.register({session: true}),
        TypeOrmModule.forFeature([User, DiscordOAuth2Credentials, UserCredentials]),
        DiscordAuthModule,
    ],
    controllers: [UsersController],
    providers: [...handlers, UsersService, UserProfile],
    exports: [UsersService],
})
export class UsersModule {}
