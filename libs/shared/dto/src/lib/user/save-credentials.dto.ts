import {Type} from 'class-transformer';
import {IsString, MinLength} from 'class-validator';

export class SaveUserCredentialsDto {
    @IsString()
    @MinLength(6)
    @Type(() => String)
    password: string;
}
