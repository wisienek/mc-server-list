import {ApiHideProperty, ApiProperty} from '@nestjs/swagger';

export class Pagination<T> {
    @ApiHideProperty()
    items: T[];

    @ApiProperty({
        type: 'number',
        description: 'Number of total items to paginate',
        example: 354,
    })
    total: number;

    @ApiProperty({
        type: 'number',
        description: 'Number of items shown per page',
        example: 10,
    })
    perPage: number;

    @ApiProperty({
        type: 'number',
        description: 'Current page number. It will be calculeted on perPage basis.',
        example: 6,
    })
    currentPage: number;

    @ApiProperty({
        type: 'number',
        description:
            'Calculated value representing number of available pages to iterate',
        example: 36,
    })
    totalPages: number;

    constructor(items: T[], total: number, perPage: number, currentPage: number) {
        this.items = items;
        this.total = total;
        this.perPage = Number(perPage);
        this.currentPage = Number(currentPage);
        this.totalPages = Math.ceil(total / perPage);
    }
}
