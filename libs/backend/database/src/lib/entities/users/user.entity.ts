import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    type Relation,
} from 'typeorm';
import {Server} from '../servers';

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({unique: true})
    email: string;

    @Column({name: 'discord_tag'})
    discordTag: string;

    @Column()
    avatar: string;

    @Column({unique: true})
    discordId: string;

    @Column()
    username: string;

    @OneToMany(() => Server, (server) => server.owner)
    servers: Relation<Server>[];
}
