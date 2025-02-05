import {MapperPickType} from '@automapper/classes/mapped-types';
import {IsInt, IsPositive} from 'class-validator';
import {ServerDto} from './server.dto';

export class ServerSummaryDto extends MapperPickType(ServerDto, [
    'id',
    'online',
    'host',
    'ip_address',
    'port',
    'versions',
    'onlinePlayers',
    'maxPlayers',
    'categories',
    'icon',
    'name',
    'ranking',
    'banner',
    'description',
]) {
    @IsInt()
    @IsPositive()
    votes: number;
}
