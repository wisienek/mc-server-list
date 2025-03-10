import {User, UserCredentials} from '@backend/db';
import {Injectable, UnauthorizedException} from '@nestjs/common';
import {PassportStrategy} from '@nestjs/passport';
import {InjectRepository} from '@nestjs/typeorm';
import {Strategy} from 'passport-local';
import {Repository} from 'typeorm';
import {compare} from 'bcrypt';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(UserCredentials)
        private readonly userCredentialsRepository: Repository<UserCredentials>,
    ) {
        super({usernameField: 'email', passwordField: 'password'});
    }

    async validate(email: string, password: string): Promise<User> {
        const credentials = await this.userCredentialsRepository.findOne({
            where: {user: {email}},
            relations: {
                user: true,
            },
        });
        const passwordMatching = await compare(
            password,
            credentials!.password as string,
        );

        if (!credentials?.user || !passwordMatching) {
            throw new UnauthorizedException();
        }

        return credentials?.user;
    }
}
