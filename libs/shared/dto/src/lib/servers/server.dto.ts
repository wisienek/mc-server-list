import {MapperOmitType} from '@automapper/classes/mapped-types';
import {AutoMap} from '@automapper/classes';
import {Type} from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    IsUUID,
    ValidateNested,
} from 'class-validator';
import {McServerSrvRecord} from '@lib/types';
import {ServerVerificationNoServerDto} from './server-verification.dto';
import {UserDto} from '../user';

export class ServerDto {
    @AutoMap()
    @IsUUID()
    @IsNotEmpty()
    id: string;

    @AutoMap()
    @IsBoolean({message: 'Online must be a boolean.'})
    online: boolean;

    @AutoMap()
    @IsString({message: 'Host must be a string.'})
    host: string;

    @AutoMap()
    @IsNumber({}, {message: 'Port must be a number.'})
    port: number;

    @AutoMap()
    @IsOptional()
    @IsString({message: 'IP address must be a string.'})
    ip_address?: string;

    @AutoMap()
    @IsBoolean({message: 'EULA blocked must be a boolean.'})
    eula_blocked: boolean;

    @AutoMap()
    @IsNumber({}, {message: 'Retrieved_at must be a number.'})
    retrieved_at: number;

    @AutoMap()
    @IsNumber({}, {message: 'Expires_at must be a number.'})
    expires_at: number;

    @AutoMap()
    @ValidateNested()
    @Type(() => McServerSrvRecord)
    srv_record: McServerSrvRecord;

    @AutoMap(() => UserDto)
    @ValidateNested()
    @Type(() => UserDto)
    owner: UserDto;

    @AutoMap()
    @IsString({message: 'Owner ID must be a string.'})
    owner_id: string;

    @AutoMap()
    @IsBoolean({message: 'isActive must be a boolean.'})
    isActive: boolean;

    @AutoMap(() => ServerVerificationNoServerDto)
    @ValidateNested()
    @Type(() => ServerVerificationNoServerDto)
    verification: ServerVerificationNoServerDto;

    @AutoMap()
    @IsArray({message: 'Versions must be an array.'})
    @IsString({each: true, message: 'Each version must be a string.'})
    versions: string[];
}

export class ServerWithNoOwnerRelation extends MapperOmitType(ServerDto, [
    'owner',
]) {}

export class ServerWithNoVerificationRelation extends MapperOmitType(ServerDto, [
    'verification',
]) {}
