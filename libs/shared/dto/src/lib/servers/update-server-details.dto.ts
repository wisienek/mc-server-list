import {PartialType, PickType} from '@nestjs/swagger';
import {ServerDetailsDto} from './server-details.dto';

export class UpdateServerDetailsDto extends PartialType(
    PickType(ServerDetailsDto, [
        'categories',
        'icon',
        'banner',
        'name',
        'description',
    ]),
) {}
