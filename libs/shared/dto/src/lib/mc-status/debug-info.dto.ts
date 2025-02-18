import {IsBoolean, IsInt} from 'class-validator';
import {AutoMap} from '@automapper/classes';

export class DebugInfo {
    @AutoMap()
    @IsBoolean()
    ping: boolean;

    @AutoMap()
    @IsBoolean()
    query: boolean;

    @AutoMap()
    @IsBoolean()
    srv: boolean;

    @AutoMap()
    @IsBoolean()
    querymismatch: boolean;

    @AutoMap()
    @IsBoolean()
    ipinsrv: boolean;

    @AutoMap()
    @IsBoolean()
    cnameinsrv: boolean;

    @AutoMap()
    @IsBoolean()
    animatedmotd: boolean;

    @AutoMap()
    @IsBoolean()
    cachehit: boolean;

    @AutoMap()
    @IsInt()
    cachetime: number;

    @AutoMap()
    @IsInt()
    cacheexpire: number;

    @AutoMap()
    @IsInt()
    apiversion: number;
}
