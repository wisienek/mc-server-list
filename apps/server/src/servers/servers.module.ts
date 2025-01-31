import {Module} from '@nestjs/common';
import {MCStatsModule} from '@backend/mc-stats';
import {ServerMapperProfile} from './server-mapper.profile';
import {ServersService} from './servers.service';

@Module({
    imports: [MCStatsModule],
    providers: [ServersService, ServerMapperProfile],
    exports: [ServersService],
})
export class ServersModule {}
