import {IQuery} from '@nestjs/cqrs';
import {PickType} from '@nestjs/swagger';
import {ServerDto} from '@shared/dto';

export class GetServerStatsQuery
    extends PickType(ServerDto, ['host', 'type'])
    implements IQuery {}
