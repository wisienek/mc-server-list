'use server';

import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function voteForServer(hostName: string): Promise<number> {
    const response = await customFetch<number>(`/servers/${hostName}/vote`, {
        method: 'POST',
    });

    revalidateTag(`/servers/${hostName}`);
    revalidateTag('/servers');

    return response;
}
