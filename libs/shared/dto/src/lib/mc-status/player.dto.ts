import {IsArray, IsInt, IsOptional, IsString, ValidateNested} from 'class-validator';
import {AutoMap} from '@automapper/classes';
import {Type} from 'class-transformer';

export class Player {
    @AutoMap()
    @IsString()
    name: string;

    @AutoMap()
    @IsString()
    uuid: string;
}

export class Players {
    @AutoMap()
    @IsInt()
    online: number;

    @AutoMap()
    @IsInt()
    max: number;

    @AutoMap()
    @IsOptional()
    @IsArray()
    @ValidateNested({each: true})
    @Type(() => Player)
    list?: Player[];
}
