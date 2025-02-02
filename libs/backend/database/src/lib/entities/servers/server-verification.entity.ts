import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    type Relation,
} from 'typeorm';
import {Server} from './server.entity';

@Entity()
export class ServerVerification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    code: string;

    @Column('bigint')
    expiresAt: number;

    @Column({type: 'boolean', default: false})
    verified: boolean;

    @OneToOne(() => Server, (server) => server.verification, {cascade: true})
    @JoinColumn({name: 'server_id'})
    server: Relation<Server>;

    @Column()
    server_id: string;
}
