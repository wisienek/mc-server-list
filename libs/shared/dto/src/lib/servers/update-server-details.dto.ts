import {IsArray, IsEnum, IsOptional} from 'class-validator';
import {PartialType, PickType} from '@nestjs/swagger';
import {Transform} from 'class-transformer';
import {ServerCategory} from '@shared/enums';
import {ServerDetailsDto} from './server-details.dto';

export class UpdateServerDetailsDto extends PartialType(
    PickType(ServerDetailsDto, ['icon', 'banner', 'name', 'description']),
) {
    @IsOptional()
    @IsArray()
    @Transform(({value}) => value?.map((v: string) => ServerCategory[v] || v))
    @IsEnum(ServerCategory, {each: true})
    categories?: ServerCategory[];
}
