import {
    IsString,
    IsOptional,
    IsEnum,
    ValidateNested,
    IsUUID,
    IsJSON,
} from 'class-validator';
import {Type} from 'class-transformer';
import {McServerInfoPlayers, McServerVersionInfo} from '@lib/types';
import {BedrockEditionEnum} from '@shared/enums';

export class BedrockServerDto {
    @IsUUID('4', {message: 'ID must be a valid UUID.'})
    id: string;

    @IsOptional()
    @IsJSON()
    version?: McServerVersionInfo;

    @ValidateNested()
    @Type(() => McServerInfoPlayers)
    players: McServerInfoPlayers;

    @IsString({message: 'Game mode must be a string.'})
    gamemode: string;

    @IsString({message: 'Server ID must be a string.'})
    serverId: string;

    @IsEnum(BedrockEditionEnum, {
        message: 'Edition must be a valid BedrockEditionEnum value.',
    })
    edition: BedrockEditionEnum;
}
