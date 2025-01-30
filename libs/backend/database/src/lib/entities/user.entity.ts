import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    type Relation,
} from 'typeorm';
import {Server} from './server.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column({unique: true})
    discordId: string;

    @Column()
    username: string;

    @OneToMany(() => Server, (server) => server.owner)
    servers: Relation<Server>[];
}
