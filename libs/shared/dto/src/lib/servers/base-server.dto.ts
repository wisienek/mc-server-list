import {
    IsBoolean,
    IsInt,
    IsString,
    IsOptional,
    IsUUID,
    IsEnum,
    Min,
    Max,
    IsIP,
    Length,
} from 'class-validator';
import {ServerType} from '@shared/enums';
import {ApiProperty} from '@nestjs/swagger';

export class ServerDto {
    @IsUUID()
    id: string;

    @IsBoolean()
    online: boolean;

    @ApiProperty({
        example: 'demo.mcstatus.io',
    })
    @IsString()
    @Length(1, 255, {message: 'Host must be between 1 and 255 characters.'})
    host: string;

    @IsInt()
    @Min(1, {message: 'Port must be at least 1.'})
    @Max(65535, {message: 'Port must not exceed 65535.'})
    port: number;

    @IsOptional()
    @IsIP('4', {message: 'IP Address must be a valid IPv4 address.'})
    ipAddress?: string;

    @IsBoolean()
    eulaBlocked: boolean;

    @IsInt()
    @Min(0, {message: 'RetrievedAt must be a positive integer.'})
    retrievedAt: number;

    @IsInt()
    @Min(0, {message: 'ExpiresAt must be a positive integer.'})
    expiresAt: number;

    @IsEnum(ServerType, {
        message: 'Type must be a valid ServerType (JAVA or BEDROCK).',
    })
    type: ServerType;
}
