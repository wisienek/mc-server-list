import {IsInt, IsOptional, IsString} from 'class-validator';
import {AutoMap} from '@automapper/classes';

export class Protocol {
    @AutoMap()
    @IsInt()
    version: number;

    @AutoMap()
    @IsOptional()
    @IsString()
    name?: string;
}
