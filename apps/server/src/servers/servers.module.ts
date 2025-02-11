import {ApiConfig, getConfigs} from '@backend/config';
import {
    BedrockServer,
    JavaServer,
    Server,
    ServerVerification,
    Vote,
} from '@backend/db';
import {Module} from '@nestjs/common';
import {MCStatsModule} from '@backend/mc-stats';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ServerMapperProfile} from './server-mapper.profile';
import {ServerVerificationService} from './server-verification.service';
import {ServersController} from './servers.controller';
import {ServersService} from './servers.service';

const configs = getConfigs(ApiConfig);

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
        ]),
    ],
    controllers: [ServersController],
    providers: [ServersService, ServerMapperProfile, ServerVerificationService],
    exports: [ServersService, ServerVerificationService],
})
export class ServersModule {}
