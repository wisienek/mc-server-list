'use server';

import {SerializedResult, serializeResult, TError} from '@core';
import {revalidateTag} from 'next/cache';
import {Result} from 'oxide.ts';
import {customFetch} from './baseFetch';

export async function voteForServer(
    hostName: string,
): Promise<SerializedResult<number>> {
    const result = await customFetch<number>(
        `/servers/${hostName}/vote`,
        {
            method: 'POST',
        },
        {
            onSuccess: () => {
                revalidateTag(`/servers/${hostName}`);
                revalidateTag('/servers');
            },
        },
    );

    return serializeResult(result);
}
