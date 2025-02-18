import {Module, Global} from '@nestjs/common';
import {RedisRepository} from './redis.repository';
import {redisClientFactory, RedisToken} from './redis.provider';
import {RedisConfig} from '@backend/config';
import {getConfigs} from '@backend/config';

@Global()
@Module({
    imports: [...getConfigs(RedisConfig)],
    providers: [redisClientFactory, RedisRepository],
    exports: [RedisRepository, RedisToken],
})
export class RedisModule {}
