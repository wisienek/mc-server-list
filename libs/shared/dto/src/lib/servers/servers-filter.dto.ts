import {ApiPropertyOptional, PartialType, PickType} from '@nestjs/swagger';
import {IsInt, IsOptional, Min} from 'class-validator';
import {ServerDto} from './base-server.dto';

export class ServerFilterDto extends PartialType(
    PickType(ServerDto, ['type', 'online', 'eulaBlocked'] as const),
) {
    @ApiPropertyOptional({
        example: 10,
        description: 'Filter by minimum number of online players.',
    })
    @IsOptional()
    @IsInt({message: 'Players online count must be an integer.'})
    @Min(0, {message: 'Players online must be at least 0.'})
    playersOnlineMin?: number;

    @ApiPropertyOptional({
        example: 100,
        description: 'Filter by maximum number of online players.',
    })
    @IsOptional()
    @IsInt({message: 'Players online count must be an integer.'})
    @Min(0, {message: 'Players online must be at least 0.'})
    playersOnlineMax?: number;
}
