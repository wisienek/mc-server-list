import {MapperOmitType} from '@automapper/classes/mapped-types';
import {AutoMap} from '@automapper/classes';
import {Type} from 'class-transformer';
import {
    IsArray,
    IsBoolean,
    IsInt,
    IsOptional,
    IsPositive,
    IsString,
    Max,
    ValidateNested,
} from 'class-validator';
import {PluginMod} from './plugin-or-mod.dto';
import {DebugInfo} from './debug-info.dto';
import {Protocol} from './protocol.dto';
import {MapInfo} from './map-info.dto';
import {Players} from './player.dto';
import {MOTD} from './motd.dto';

export class MinecraftServerOfflineStatus {
    @AutoMap()
    @IsBoolean()
    online: boolean;

    @AutoMap()
    @IsOptional()
    @IsString()
    ip?: string;

    @AutoMap()
    @IsOptional()
    @IsInt()
    @IsPositive()
    @Max(65536)
    port?: number;

    @AutoMap()
    @IsOptional()
    @IsString()
    hostname?: string;

    @AutoMap()
    @ValidateNested()
    @Type(() => DebugInfo)
    debug: DebugInfo;
}

export class MinecraftServerOnlineStatus extends MapperOmitType(
    MinecraftServerOfflineStatus,
    ['ip', 'port'],
) {
    @AutoMap()
    @IsString()
    ip!: string;

    @AutoMap()
    @IsInt()
    port!: number;

    @AutoMap()
    @IsOptional()
    @IsString()
    version?: string;

    @AutoMap()
    @ValidateNested()
    @Type(() => Protocol)
    protocol?: Protocol;

    @AutoMap()
    @IsOptional()
    @IsString()
    icon?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    software?: string;

    @AutoMap()
    @ValidateNested()
    @Type(() => MapInfo)
    map: MapInfo;

    @AutoMap()
    @IsOptional()
    @IsString()
    gamemode?: string;

    @AutoMap()
    @IsOptional()
    @IsString()
    serverid?: string;

    @AutoMap()
    @IsOptional()
    @IsBoolean()
    eula_blocked?: boolean;

    @AutoMap()
    @ValidateNested()
    @Type(() => MOTD)
    motd: MOTD;

    @AutoMap()
    @ValidateNested()
    @Type(() => Players)
    players: Players;

    @AutoMap()
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PluginMod)
    plugins?: PluginMod[];

    @AutoMap()
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => PluginMod)
    mods?: PluginMod[];
}
