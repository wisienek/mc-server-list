import {ApiConfig, getConfigs} from '@backend/config';
import {
    BedrockServer,
    JavaServer,
    Server,
    ServerRanking,
    ServerVerification,
    Vote,
} from '@backend/db';
import {Module} from '@nestjs/common';
import {MCStatsModule} from '@backend/mc-stats';
import {TypeOrmModule} from '@nestjs/typeorm';
import {
    GetServerStatsQueryHandler,
    VerifyServerCommandHandler,
    VerifyTimeoutsCommandHandler,
} from './handlers';
import {ServerMapperProfile} from './server-mapper.profile';
import {ServerVerificationService} from './server-verification.service';
import {ServersController} from './servers.controller';
import {ServersService} from './servers.service';

const configs = getConfigs(ApiConfig);

const handlers = [
    VerifyServerCommandHandler,
    GetServerStatsQueryHandler,
    VerifyTimeoutsCommandHandler,
];

@Module({
    imports: [
        ...configs,
        MCStatsModule,
        TypeOrmModule.forFeature([
            Server,
            JavaServer,
            BedrockServer,
            ServerVerification,
            Vote,
            ServerRanking,
        ]),
    ],
    controllers: [ServersController],
    providers: [
        ServersService,
        ServerMapperProfile,
        ServerVerificationService,
        ...handlers,
    ],
    exports: [ServersService, ServerVerificationService],
})
export class ServersModule {}
