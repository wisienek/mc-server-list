import {HttpService} from '@nestjs/axios';
import {Injectable} from '@nestjs/common';
import {firstValueFrom} from 'rxjs';
import {
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
} from '@shared/dto';
import {Logger} from '@backend/logger';

@Injectable()
export class MCStatsService {
    constructor(
        private readonly httpService: HttpService,
        private readonly logger: Logger,
    ) {}

    public async fetchServerInfo(
        address: string,
        bedrock = false,
    ): Promise<MinecraftServerOfflineStatus | MinecraftServerOnlineStatus> {
        const path = `${bedrock ? '/bedrock' : ''}/3/${address}`;

        try {
            return (
                await firstValueFrom(
                    this.httpService.get<
                        MinecraftServerOfflineStatus | MinecraftServerOnlineStatus
                    >(path, {
                        headers: {
                            // some mock
                            'User-Agent': `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 OPR/114.0.0.0`,
                        },
                    }),
                )
            ).data;
        } catch (error) {
            this.logger.error(`Error when fetching mc-server info`, error);
            return null;
        }
    }
}
