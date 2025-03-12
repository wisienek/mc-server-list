import {CreateServerVerificationCommand} from '@backend/commander';
import {ServerVerification} from '@backend/db';
import {SimpleLogger} from '@backend/logger';
import {CommandHandler, ICommandHandler} from '@nestjs/cqrs';
import {InjectRepository} from '@nestjs/typeorm';
import {Repository} from 'typeorm';
import {randomInt} from 'crypto';

@CommandHandler(CreateServerVerificationCommand)
export class CreateServerVerificationCommandHandler
    implements ICommandHandler<CreateServerVerificationCommand>
{
    private readonly logger = SimpleLogger.create(
        CreateServerVerificationCommandHandler.name,
    );

    constructor(
        @InjectRepository(ServerVerification)
        private readonly serverVerificationRepository: Repository<ServerVerification>,
    ) {}

    async execute(
        command: CreateServerVerificationCommand,
    ): Promise<ServerVerification> {
        const {serverId, userId} = command;

        let verification = await this.serverVerificationRepository.findOne({
            where: {server_id: serverId, user_id: userId},
        });

        if (verification) {
            return verification;
        }

        let code: string;
        do {
            code = this.generateRandomString();
        } while (await this.serverVerificationRepository.exists({where: {code}}));

        verification = this.serverVerificationRepository.create({
            server_id: serverId,
            user_id: userId,
            code,
            verified: false,
        });

        this.logger.log(
            `Created new verification for server ${serverId} and user: ${userId} with code; ${code}`,
        );

        return await this.serverVerificationRepository.save(verification);
    }

    private generateRandomString(length: number = 32): string {
        const allowedChars = Array.from({length: 95}, (_, i) =>
            String.fromCharCode(i + 32),
        ).join('');
        let result = '';

        for (let i = 0; i < length; i++) {
            const randomIndex = randomInt(0, allowedChars.length);
            result += allowedChars[randomIndex];
        }

        return result.replace(/\s|&|§/, '');
    }
}
