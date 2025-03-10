'use server';

import {UserDto} from '@shared/dto';
import {revalidateTag} from 'next/cache';
import {customFetch} from './baseFetch';

export async function loginUser(data: {
    email: string;
    password: string;
}): Promise<UserDto> {
    return await customFetch<UserDto>(
        `/users/login/credentials`,
        {
            method: 'POST',
            body: JSON.stringify(data),
            next: {tags: ['/users/login/credentials']},
        },
        {
            onSuccess: () => {
                revalidateTag('/users/status');
                revalidateTag('/users/has-credentials');
            },
        },
    );
}
