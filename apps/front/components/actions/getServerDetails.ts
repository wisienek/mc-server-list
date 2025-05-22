'use server';

import {SerializedResult, serializeResult} from '@core';
import {ServerDetailsDto} from '@shared/dto';
import {customFetch} from './baseFetch';

export async function getServerDetails(
    host: string,
): Promise<SerializedResult<ServerDetailsDto>> {
    const result = await customFetch<ServerDetailsDto>(`/servers/${host}`, {
        next: {tags: ['/servers', `/servers/${host}`]},
    });

    return serializeResult(result);
}
