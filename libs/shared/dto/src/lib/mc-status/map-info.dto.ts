import {AutoMap} from '@automapper/classes';
import {IsString} from 'class-validator';

export class MapInfo {
    @AutoMap()
    @IsString()
    raw: string;

    @AutoMap()
    @IsString()
    clean: string;

    @AutoMap()
    @IsString()
    html: string;
}
