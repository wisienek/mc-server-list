import {AutoMap} from '@automapper/classes';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    type Relation,
    TableInheritance,
    OneToMany,
    CreateDateColumn,
} from 'typeorm';
import {McServerMotd, McServerSrvRecord} from '@lib/types';
import {ServerCategory, ServerType} from '@shared/enums';
import {ServerRanking} from './ranking-view.entity';
import {ServerVerification} from './server-verification.entity';
import {Vote} from './vote.entity';
import {User} from '../users';

@Entity()
@TableInheritance({column: {type: 'enum', name: 'type', enum: ServerType}})
export class Server {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column({
        enum: ServerType,
        type: 'enum',
        nullable: false,
        default: ServerType.JAVA,
    })
    type: ServerType;

    @AutoMap()
    @Column()
    online: boolean;

    @AutoMap()
    @Column()
    host: string;

    @AutoMap()
    @Column()
    port: number;

    @AutoMap()
    @Column({nullable: true})
    ip_address?: string;

    @AutoMap()
    @Column()
    eula_blocked: boolean;

    @AutoMap()
    @Column({type: 'jsonb'})
    srv_record: McServerSrvRecord;

    @AutoMap()
    @Column({type: 'jsonb'})
    motd: McServerMotd;

    @AutoMap()
    @ManyToOne(() => User, (user) => user.servers)
    @JoinColumn({name: 'owner_id', referencedColumnName: 'id'})
    owner: Relation<User>;

    @AutoMap()
    @Column()
    owner_id: string;

    @AutoMap()
    @Column({default: false, type: 'boolean'})
    isActive: boolean;

    @AutoMap()
    @OneToOne(() => ServerVerification, (verification) => verification.server)
    verification: Relation<ServerVerification>;

    @AutoMap()
    @Column('text', {array: true, default: '{}'})
    versions: string[];

    // additional sugar data
    @AutoMap()
    @Column({type: 'enum', array: true, enum: ServerCategory, default: []})
    categories: ServerCategory[];

    @AutoMap()
    @Column({nullable: true})
    icon?: string;

    @AutoMap()
    @Column({nullable: true})
    banner?: string;

    @AutoMap()
    @Column({nullable: true})
    name?: string;

    @AutoMap()
    @Column({nullable: true})
    description?: string;

    @OneToMany(() => Vote, (vote) => vote.server)
    votes: Relation<Vote>[];

    @OneToOne(() => ServerRanking, {nullable: true})
    @JoinColumn({name: 'id', referencedColumnName: 'serverId'})
    rankingData: ServerRanking;

    @CreateDateColumn()
    createdAt: Date;
}
