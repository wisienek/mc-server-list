import type {ISession} from 'connect-typeorm/out';
import {Column, DeleteDateColumn, Entity, Index, PrimaryColumn} from 'typeorm';

@Entity()
export class Session implements ISession {
    @PrimaryColumn('varchar', {length: 255})
    id: string;

    @Column('text')
    json: string;

    @Index()
    @Column('bigint', {default: Date.now()})
    expiredAt: number;

    @DeleteDateColumn()
    destroyedAt?: Date;
}
