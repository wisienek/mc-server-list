import {GetUserQuery} from '@backend/commander';
import {User} from '@backend/db';
import {type IQueryHandler, QueryHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';

@QueryHandler(GetUserQuery)
export class GetUserHandler implements IQueryHandler<GetUserQuery> {
    constructor(
        @InjectRepository(User) private readonly usersRepository: Repository<User>,
    ) {}

    async execute(query: GetUserQuery): Promise<User> {
        return this.usersRepository.findOne({
            where: {
                id: query?.id,
                email: query?.email,
                discordId: query?.discordId,
                discordTag: query?.discordTag,
                username: query?.username,
            },
            relations: {
                servers: true,
                votes: true,
            },
        });
    }
}
