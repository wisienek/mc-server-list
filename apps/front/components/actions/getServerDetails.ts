'use server';

import {ServerDetailsDto} from '@shared/dto';
import {customFetch} from './baseFetch';

export async function getServerDetails(host: string): Promise<ServerDetailsDto> {
    const result = await customFetch<ServerDetailsDto>(`/servers/${host}`, {
        next: {tags: ['/servers', `/servers/${host}`]},
    });

    if (result.isErr()) {
        return null;
    }

    return result.unwrap();
}
