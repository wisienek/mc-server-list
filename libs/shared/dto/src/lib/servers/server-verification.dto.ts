import {MapperOmitType} from '@automapper/classes/mapped-types';
import {AutoMap} from '@automapper/classes';
import {Type} from 'class-transformer';
import {
    IsBoolean,
    IsNumber,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import {ServerWithNoVerificationRelation} from './server.dto';

export class ServerVerificationDto {
    @AutoMap()
    @IsUUID()
    id: string;

    @AutoMap()
    @IsString({message: 'Verification code must be a string.'})
    code: string;

    @AutoMap()
    @IsNumber({}, {message: 'ExpiresAt must be a number.'})
    expiresAt: number;

    @AutoMap()
    @IsBoolean({message: 'Verified must be a boolean.'})
    verified: boolean;

    @AutoMap()
    @IsString({message: 'Server ID must be a string.'})
    server_id: string;

    @AutoMap(() => ServerWithNoVerificationRelation)
    @ValidateNested()
    @Type(() => ServerWithNoVerificationRelation)
    server: ServerWithNoVerificationRelation;
}

export class ServerVerificationNoServerDto extends MapperOmitType(
    ServerVerificationDto,
    ['server'],
) {}
