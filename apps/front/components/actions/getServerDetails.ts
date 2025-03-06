'use server';

import {ServerDetailsDto} from '@shared/dto';
import {customFetch} from './baseFetch';

export async function getServerDetails(host: string): Promise<ServerDetailsDto> {
    return customFetch<ServerDetailsDto>(`/servers/${host}`, {
        next: {tags: ['/servers', `/servers/${host}`]},
    });
}
