import {BedrockServer, JavaServer, Server, ServerVerification} from '@backend/db';
import {Module} from '@nestjs/common';
import {MCStatsModule} from '@backend/mc-stats';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ServerMapperProfile} from './server-mapper.profile';
import {ServersController} from './servers.controller';
import {ServersService} from './servers.service';

@Module({
    imports: [
        MCStatsModule,
        TypeOrmModule.forFeature([
            Server,
            JavaServer,
            BedrockServer,
            ServerVerification,
        ]),
    ],
    controllers: [ServersController],
    providers: [ServersService, ServerMapperProfile],
    exports: [ServersService],
})
export class ServersModule {}
