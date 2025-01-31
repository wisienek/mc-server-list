import {IsArray, IsString} from 'class-validator';
import {AutoMap} from '@automapper/classes';

export class MOTD {
    @AutoMap()
    @IsArray()
    @IsString({each: true})
    raw: string[];

    @AutoMap()
    @IsArray()
    @IsString({each: true})
    clean: string[];

    @AutoMap()
    @IsArray()
    @IsString({each: true})
    html: string[];
}
