import {DiscordAuthModule} from '@backend/auth';
import {PassportModule} from '@nestjs/passport';
import {TypeOrmModule} from '@nestjs/typeorm';
import {Module} from '@nestjs/common';
import {User} from '@backend/db';
import {UsersService} from './users.service';

@Module({
    imports: [
        PassportModule.register({session: true}),
        TypeOrmModule.forFeature([User]),
        DiscordAuthModule,
    ],
    providers: [UsersService],
    exports: [UsersService],
})
export class UsersModule {}
