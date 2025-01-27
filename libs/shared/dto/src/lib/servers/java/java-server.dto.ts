import {
    IsUUID,
    IsString,
    IsOptional,
    MaxLength,
    IsJSON,
    IsArray,
    ValidateNested,
} from 'class-validator';
import {
    McServerJavaVersionInfo,
    McServerMod,
    McServerMotd,
    McServerPlugin,
    McServerSrvRecord,
} from '@lib/types';

export class JavaServerDto {
    @IsUUID('4', {message: 'ID must be a valid UUID.'})
    id: string;

    @IsOptional()
    @IsString()
    @MaxLength(255, {message: 'Icon must not exceed 255 characters.'})
    icon?: string;

    @IsOptional()
    @IsString()
    @MaxLength(255, {message: 'Software must not exceed 255 characters.'})
    software?: string;

    @IsOptional()
    @IsJSON()
    @ValidateNested()
    version?: McServerJavaVersionInfo;

    @IsArray()
    players: [];

    @IsOptional()
    @IsArray()
    @ValidateNested()
    motd: McServerMotd[];

    @IsOptional()
    @IsArray()
    @ValidateNested()
    mods?: McServerMod[];

    @IsOptional()
    @IsArray()
    @ValidateNested()
    plugins?: McServerPlugin[];

    @IsOptional()
    @ValidateNested()
    srvRecord?: McServerSrvRecord;
}
