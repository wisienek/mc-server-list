import {ApiProperty} from '@nestjs/swagger';
import {AutoMap} from '@automapper/classes';
import {
    IsEnum,
    IsInt,
    IsNumber,
    IsPositive,
    IsString,
    Max,
    ValidateIf,
} from 'class-validator';
import {ServerType} from '@shared/enums';

export class CreateServerDto {
    @AutoMap()
    @IsString()
    @ValidateIf((o) => o.hostname === undefined)
    ip?: string;

    @AutoMap()
    @IsString()
    @ValidateIf((o) => o.ip === undefined)
    hostname?: string;

    @AutoMap()
    @IsInt()
    @IsPositive()
    @Max(65536)
    port: number;

    @AutoMap()
    @IsEnum(ServerType)
    type: ServerType;
}

export class CreateServerResponseDto {
    @ApiProperty({
        description: `Code that has to be put inside a MOTD file and verified.`,
    })
    @IsString()
    @AutoMap()
    code: string;

    @IsNumber()
    @IsPositive()
    @AutoMap()
    expiresAt: number;

    @IsString()
    @AutoMap()
    host: string;
}
