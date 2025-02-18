import {AutoMap} from '@automapper/classes';
import {IsEmail, IsString, IsUUID} from 'class-validator';

export class UserDto {
    @AutoMap()
    @IsUUID()
    id: string;

    @AutoMap()
    @IsEmail({}, {message: 'Email must be valid.'})
    email: string;

    @AutoMap()
    @IsString({message: 'Discord ID must be a string.'})
    discordId: string;

    @AutoMap()
    @IsString({message: 'Discord Tag must be a string.'})
    discordTag: string;

    @AutoMap()
    @IsString({message: 'Username must be a string.'})
    username: string;

    @AutoMap()
    @IsString({message: 'Avatar must be a string.'})
    avatar?: string;

    // @AutoMap(() => [SimplifiedServerDto])
    // @ValidateNested({ each: true })
    // @Type(() => SimplifiedServerDto)
    // servers?: SimplifiedServerDto[];
}
