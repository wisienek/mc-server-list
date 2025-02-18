import {ChildEntity, Column} from 'typeorm';
import {McJavaServerInfoPlayers, McServerMod, McServerPlugin} from '@lib/types';
import {ServerType} from '@shared/enums';
import {Server} from './server.entity';

@ChildEntity(ServerType.JAVA)
export class JavaServer extends Server {
    @Column({type: 'jsonb', nullable: true})
    players?: McJavaServerInfoPlayers;

    @Column()
    icon: string;

    @Column({type: 'jsonb'})
    mods: Array<McServerMod>;

    @Column({nullable: true})
    software?: string;

    @Column({type: 'jsonb', nullable: true})
    plugins?: Array<McServerPlugin>;
}
