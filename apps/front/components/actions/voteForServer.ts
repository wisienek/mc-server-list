'use server';

import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function voteForServer(hostName: string): Promise<number> {
    return await customFetch<number>(
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
}
