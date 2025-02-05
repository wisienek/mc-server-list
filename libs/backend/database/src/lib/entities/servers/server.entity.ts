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
} from 'typeorm';
import {McServerSrvRecord} from '@lib/types';
import {ServerCategory, ServerType} from '@shared/enums';
import {ServerVerification} from './server-verification.entity';
import {User} from '../users';
import {Vote} from './vote.entity';

@Entity()
@TableInheritance({column: {type: 'enum', name: 'type', enum: ServerType}})
export class Server {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

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
}
