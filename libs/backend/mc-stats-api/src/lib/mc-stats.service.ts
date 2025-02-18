import {Injectable, Logger} from '@nestjs/common';
import {HttpService} from '@nestjs/axios';
import {plainToClass} from 'class-transformer';
import {firstValueFrom} from 'rxjs';
import {
    MinecraftServerOfflineStatus,
    MinecraftServerOnlineStatus,
} from '@shared/dto';

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
            const fetchedData = (
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

            return plainToClass(
                'players' in fetchedData && typeof fetchedData.players === 'object'
                    ? MinecraftServerOnlineStatus
                    : MinecraftServerOfflineStatus,
                fetchedData,
            );
        } catch (error) {
            this.logger.error(`Error when fetching mc-server info`, error);
            return null;
        }
    }
}
