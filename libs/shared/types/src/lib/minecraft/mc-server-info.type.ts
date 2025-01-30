import {
    IsString,
    IsUUID,
    IsInt,
    IsArray,
    ValidateNested,
    IsOptional,
} from 'class-validator';
import {Type} from 'class-transformer';

export class McServerPlayerInfo {
    @IsUUID('4', {message: 'UUID must be a valid version 4 UUID.'})
    uuid: string;

    @IsString({message: 'Raw name must be a string.'})
    name_raw: string;

    @IsString({message: 'Clean name must be a string.'})
    name_clean: string;

    @IsString({message: 'HTML name must be a string.'})
    name_html: string;
}

export class McServerInfoPlayers {
    @IsInt({message: 'Online players count must be an integer.'})
    online: number;

    @IsInt({message: 'Max players count must be an integer.'})
    max: number;
}

export class McJavaServerInfoPlayers extends McServerInfoPlayers {
    @IsArray({message: 'Players list must be an array.'})
    @ValidateNested({each: true})
    @Type(() => McServerPlayerInfo)
    list: McServerPlayerInfo[];
}

export class McServerVersionInfo {
    @IsInt({message: 'Protocol version must be an integer.'})
    protocol: number;
}

export class McServerBedrockVersionInfo extends McServerVersionInfo {
    @IsString({message: 'Raw name must be a string.'})
    name: string;
}

export class McServerJavaVersionInfo extends McServerVersionInfo {
    @IsString({message: 'Raw name must be a string.'})
    name_raw: string;

    @IsString({message: 'Clean name must be a string.'})
    name_clean: string;

    @IsString({message: 'HTML name must be a string.'})
    name_html: string;
}

export class McServerMotd {
    @IsString({message: 'Raw MOTD must be a string.'})
    raw: string;

    @IsString({message: 'Clean MOTD must be a string.'})
    clean: string;

    @IsString({message: 'HTML MOTD must be a string.'})
    html: string;
}

export class McServerMod {
    @IsString({message: 'Mod name must be a string.'})
    name: string;

    @IsString({message: 'Mod version must be a string.'})
    version: string;
}

export class McServerPlugin {
    @IsString({message: 'Plugin name must be a string.'})
    name: string;

    @IsOptional()
    @IsString({message: 'Plugin version must be a string or null.'})
    version: string | null;
}

export class McServerSrvRecord {
    @IsString({message: 'Host must be a string.'})
    host: string;

    @IsInt({message: 'Port must be an integer.'})
    port: number;
}
