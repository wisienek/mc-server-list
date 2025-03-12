import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    JoinColumn,
    ManyToOne,
    Unique,
    type Relation,
} from 'typeorm';
import {Server} from './server.entity';
import {User} from '../users';

@Unique(['server_id', 'user_id'])
@Entity()
export class ServerVerification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column({type: 'boolean', default: false})
    verified: boolean;

    @ManyToOne(() => Server, (server) => server.verifications, {cascade: true})
    @JoinColumn({name: 'server_id'})
    server: Relation<Server>;

    @Column()
    server_id: string;

    @ManyToOne(() => User, (user) => user.verifications, {cascade: true})
    @JoinColumn({name: 'user_id'})
    user: Relation<User>;

    @Column()
    user_id: string;
}
