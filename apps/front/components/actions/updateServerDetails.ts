'use server';

import {TError} from '@core';
import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';
import {revalidateTag} from 'next/cache';
import {Result} from 'oxide.ts';
import {customFetch} from './baseFetch';

export async function updateServerDetails(
    host: string,
    details: UpdateServerDetailsDto,
): Promise<Result<ServerDetailsDto, TError>> {
    return await customFetch<ServerDetailsDto>(
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
}
