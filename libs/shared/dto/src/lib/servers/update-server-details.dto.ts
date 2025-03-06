import {
    IsArray,
    IsEnum,
    IsOptional,
    IsString,
    IsUrl,
    MaxLength,
    MinLength,
} from 'class-validator';
import {Transform} from 'class-transformer';
import {ServerCategory} from '@shared/enums';

export class UpdateServerDetailsDto {
    @IsOptional()
    @IsArray()
    @Transform(({value}) => value?.map((v: string) => ServerCategory[v] || v))
    @IsEnum(ServerCategory, {each: true})
    categories?: ServerCategory[];

    @IsOptional()
    @IsString()
    @MinLength(3)
    @MaxLength(32)
    name?: string;

    @IsUrl()
    @IsOptional()
    icon?: string;

    @IsUrl()
    @IsOptional()
    banner?: string;

    @IsOptional()
    @IsString()
    @MaxLength(512)
    description?: string;
}
