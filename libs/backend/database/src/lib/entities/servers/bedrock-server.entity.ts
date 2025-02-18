import {Column, ChildEntity} from 'typeorm';
import {McServerInfoPlayers} from '@lib/types';
import {ServerType} from '@shared/enums';
import {Server} from './server.entity';

@ChildEntity(ServerType.BEDROCK)
export class BedrockServer extends Server {
    @Column({type: 'jsonb', nullable: true})
    players?: McServerInfoPlayers;

    @Column()
    gamemode!: string;

    @Column()
    server_id!: string;
}
