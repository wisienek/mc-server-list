import {ApiProperty} from '@nestjs/swagger';
import {IsPositive} from 'class-validator';

export class PaginatedInputDto {
    @ApiProperty()
    @IsPositive()
    perPage: number;

    @ApiProperty()
    @IsPositive()
    page: number;
}
