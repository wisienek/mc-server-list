import {Column, ChildEntity} from 'typeorm';
import {
    McServerBedrockVersionInfo,
    McServerInfoPlayers,
    McServerMotd,
} from '@lib/types';
import {BedrockEditionEnum, ServerType} from '@shared/enums';
import {Server} from './server.entity';

@ChildEntity(ServerType.BEDROCK)
export class BedrockServer extends Server {
    @Column({type: 'jsonb', nullable: true})
    version?: McServerBedrockVersionInfo;

    @Column({type: 'jsonb', nullable: true})
    players?: McServerInfoPlayers;

    @Column({type: 'jsonb', nullable: true})
    motd?: McServerMotd;

    @Column()
    gamemode!: string;

    @Column()
    server_id!: string;

    @Column({type: 'enum', enum: BedrockEditionEnum})
    edition!: BedrockEditionEnum;
}
