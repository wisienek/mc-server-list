import {MapperPickType} from '@automapper/classes/mapped-types';
import {IsInt, IsOptional, IsPositive, IsString} from 'class-validator';
import {ServerDto} from './server.dto';

export class ServerSummaryDto extends MapperPickType(ServerDto, [
    'id',
    'online',
    'type',
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
    'isActive',
]) {
    @IsInt()
    @IsPositive()
    votes: number;

    @IsString()
    @IsOptional()
    verificationCode?: string;
}
