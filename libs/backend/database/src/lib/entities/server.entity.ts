import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToOne,
    type Relation,
    TableInheritance,
} from 'typeorm';
import {McServerSrvRecord} from '@lib/types';
import {ServerType} from '@shared/enums';
import {ServerVerification} from './server-verification.entity';
import {User} from './user.entity';

@Entity()
@TableInheritance({column: {type: 'enum', name: 'type', enum: ServerType}})
export class Server {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    online: boolean;

    @Column()
    host: string;

    @Column()
    port: number;

    @Column({nullable: true})
    ip_address?: string;

    @Column()
    eula_blocked: boolean;

    @Column({type: 'jsonb'})
    srv_record: McServerSrvRecord;

    @ManyToOne(() => User, (user) => user.servers)
    @JoinColumn({name: 'owner_id', referencedColumnName: 'id'})
    owner: Relation<User>;

    @Column()
    owner_id: string;

    @Column({default: false, type: 'boolean'})
    isActive: boolean;

    @OneToOne(() => ServerVerification, (verification) => verification.server)
    verification: Relation<ServerVerification>;

    @Column('text', {array: true, default: '{}'})
    versions: string[];
}
