import {AutoMap} from '@automapper/classes';
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
    type Relation,
    OneToOne,
} from 'typeorm';
import {UserCredentials} from './user-credentials.entity';
import {Server, Vote} from '../servers';

@Entity()
export class User {
    @AutoMap()
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @AutoMap()
    @Column({unique: true})
    email: string;

    @AutoMap()
    @Column({name: 'discord_tag'})
    discordTag: string;

    @AutoMap()
    @Column({nullable: true})
    avatar?: string | null;

    @AutoMap()
    @Column({unique: true})
    discordId: string;

    @AutoMap()
    @Column()
    username: string;

    @AutoMap(() => [Server])
    @OneToMany(() => Server, (server) => server.owner)
    servers: Relation<Server>[];

    @AutoMap(() => [Vote])
    @OneToMany(() => Vote, (vote) => vote.user)
    votes: Relation<Vote>[];

    @OneToOne(() => UserCredentials, (credentials) => credentials.user, {
        cascade: true,
        eager: true,
    })
    credentials: Relation<UserCredentials>;
}
