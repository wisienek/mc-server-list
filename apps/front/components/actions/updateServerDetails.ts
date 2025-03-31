'use server';

import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';
import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function updateServerDetails(
    host: string,
    details: UpdateServerDetailsDto,
): Promise<ServerDetailsDto> {
    const result = await customFetch<ServerDetailsDto>(
        `/servers/${host}/details`,
        {
            method: 'PATCH',
            body: JSON.stringify(details),
        },
        {
            onSuccess: () => {
                revalidateTag(`/servers/${host}`);
                revalidateTag('/servers');
            },
        },
    );

    if (result.isErr()) {
        return null;
    }

    return result.unwrap();
}
