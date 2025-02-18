import {AutoMap} from '@automapper/classes';
import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    Relation,
    Unique,
} from 'typeorm';
import {User} from '../users';
import {Server} from './server.entity';

@Unique(['server_id', 'user_id'])
@Entity()
export class Vote {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Server, (server) => server.votes, {cascade: true})
    @JoinColumn({name: 'server_id', referencedColumnName: 'id'})
    server: Relation<Server>;

    @AutoMap()
    @Column()
    server_id: string;

    @ManyToOne(() => User, (user) => user.votes, {cascade: true})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: Relation<User>;

    @AutoMap()
    @Column()
    user_id: string;
}
