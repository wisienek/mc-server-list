'use server';

import {SerializedResult, serializeResult} from '@core';
import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';
import {ServerSummaryDto} from '@shared/dto';

export async function reVerifyTimedOutServer(
    hostName: string,
): Promise<SerializedResult<ServerSummaryDto>> {
    const result = await customFetch<ServerSummaryDto>(
        `/servers/${hostName}/re-verify-timeout`,
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
