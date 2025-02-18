import {ApiProperty} from '@nestjs/swagger';
import {Type} from 'class-transformer';
import {IsInt, IsNumber, IsPositive} from 'class-validator';

export class PaginatedInputDto {
    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @IsInt()
    @Type(() => Number)
    perPage: number;

    @ApiProperty()
    @IsPositive()
    @IsNumber()
    @IsInt()
    @Type(() => Number)
    page: number;
}
