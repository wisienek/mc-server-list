'use server';

import {SerializedResult, serializeResult} from '@core';
import {ServerSummaryDto, VerifyServerDto} from '@shared/dto';
import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function verifyServer(
    server: ServerSummaryDto,
): Promise<SerializedResult<ServerSummaryDto>> {
    const payload: VerifyServerDto = {
        ...(server.ip_address ? {ip: server.ip_address} : {hostname: server.host}),
        port: server.port,
        type: server.type,
    };

    const result = await customFetch<ServerSummaryDto>(
        `/servers/${server.host}/verify`,
        {
            method: 'PATCH',
            body: JSON.stringify(payload),
        },
        {
            onSuccess: () => {
                revalidateTag(`/servers/${server.host}`);
                revalidateTag('/servers');
            },
        },
    );

    return serializeResult(result);
}
