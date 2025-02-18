import {AutoMap} from '@automapper/classes';
import {IsString} from 'class-validator';

export class PluginMod {
    @AutoMap()
    @IsString()
    name: string;

    @AutoMap()
    @IsString()
    version: string;
}
