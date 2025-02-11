import {MapperPickType} from '@automapper/classes/mapped-types';
import {ApiPropertyOptional, IntersectionType, PartialType} from '@nestjs/swagger';
import {ServerCategory} from '@shared/enums';
import {Transform, Type} from 'class-transformer';
import {IsArray, IsBoolean, IsEnum, IsOptional} from 'class-validator';
import {PaginatedInputDto} from '../pagination';
import {ServerDto} from '../servers';

export class ListServersDto extends PartialType(
    IntersectionType(
        MapperPickType(ServerDto, ['eula_blocked', 'online', 'versions']),
        PaginatedInputDto,
    ),
) {
    @ApiPropertyOptional({
        description: `If should return only user's servers`,
    })
    @IsBoolean()
    @Transform(({value}) => value === 'true')
    @IsOptional()
    isOwn?: boolean;

    @ApiPropertyOptional({
        description: 'Server categories',
    })
    @Transform(({value}) => {
        if (value === undefined) return undefined;
        if (Array.isArray(value)) return value;
        if (typeof value === 'string') return value.split(',');
        return value;
    })
    @Type(() => String)
    @IsArray()
    @IsEnum(ServerCategory, {each: true})
    @IsOptional()
    categories?: ServerCategory[];
}
