import {InjectRepository} from '@nestjs/typeorm';
import {Injectable} from '@nestjs/common';
import {BedrockServer, JavaServer} from '@backend/db';
import {Logger} from '@backend/logger';
import {Repository} from 'typeorm';

@Injectable()
export class ServersService {
    constructor(
        @InjectRepository(JavaServer)
        private readonly javaServerRepository: Repository<JavaServer>,
        @InjectRepository(BedrockServer)
        private readonly bedrockServerRepository: Repository<BedrockServer>,
        private readonly logger: Logger,
    ) {}
}
