import {MapperPickType} from '@automapper/classes/mapped-types';
import {IntersectionType, PartialType} from '@nestjs/swagger';
import {PaginatedInputDto} from '../pagination';
import {ServerDto} from '../servers';

export class ListServersDto extends PartialType(
    IntersectionType(
        MapperPickType(ServerDto, ['eula_blocked', 'online', 'versions']),
        PaginatedInputDto,
    ),
) {}
