'use server';

import type {CreateServerDto, CreateServerResponseDto} from '@shared/dto';
import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function createServer(
    data: CreateServerDto,
): Promise<CreateServerResponseDto> {
    return await customFetch<CreateServerResponseDto>(
        `/servers`,
        {
            method: 'POST',
            body: JSON.stringify(data),
        },
        {
            onSuccess: () => {
                revalidateTag('/servers');
            },
        },
    );
}
