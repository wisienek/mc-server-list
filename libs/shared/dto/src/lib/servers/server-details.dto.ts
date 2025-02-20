import {
    MapperIntersectionType,
    MapperPickType,
} from '@automapper/classes/mapped-types';
import {ApiPropertyOptional} from '@nestjs/swagger';
import {IsBoolean, IsOptional} from 'class-validator';
import {ServerSummaryDto} from './server-summary.dto';
import {ServerDto} from './server.dto';

export class ServerDetailsDto extends MapperIntersectionType(
    ServerDto,
    MapperPickType(ServerSummaryDto, ['votes', 'isLiked', 'verificationCode']),
) {
    @ApiPropertyOptional({
        description: 'True if requester is owner.',
    })
    @IsOptional()
    @IsBoolean()
    isOwner?: boolean;
}
