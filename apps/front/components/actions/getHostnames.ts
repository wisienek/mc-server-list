'use server';

import axios from 'axios';

export async function getHostnames(): Promise<string[]> {
    const response = await axios.get<string[]>(
        `${process.env.NEXT_PUBLIC_API_URL}/servers/hostnames`,
        {withCredentials: true},
    );

    return response.data;
}
