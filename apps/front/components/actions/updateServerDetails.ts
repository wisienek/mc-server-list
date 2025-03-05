'use server';

import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';
import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function updateServerDetails(
    host: string,
    details: UpdateServerDetailsDto,
): Promise<ServerDetailsDto> {
    const response = await customFetch<ServerDetailsDto>(
        `/servers/${host}/details`,
        {
            method: 'PATCH',
            body: JSON.stringify(details),
        },
    );

    revalidateTag(`/servers/${host}`);
    revalidateTag('/servers');

    return response;
}
