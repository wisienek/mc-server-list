import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    type Relation,
} from 'typeorm';
import {User} from './user.entity';

@Entity()
export class UserCredentials {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({nullable: true})
    password?: string;

    @OneToOne(() => User, (user) => user.credentials, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'user_id', referencedColumnName: 'id'})
    user: Relation<User>;

    @Column()
    user_id: string;

    // Future proof
    // @Column({ nullable: true })
    // resetToken?: string;
    //
    // @Column({ type: 'timestamp', nullable: true })
    // passwordChangedAt?: Date;
}
