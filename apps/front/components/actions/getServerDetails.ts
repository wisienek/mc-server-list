'use server';

import {ServerDetailsDto} from '@shared/dto';
import axios from 'axios';

export async function getServerDetails(host: string): Promise<ServerDetailsDto> {
    const response = await axios.get<ServerDetailsDto>(
        `${process.env.NEXT_PUBLIC_API_URL}/servers/${host}`,
        {withCredentials: true},
    );

    return response.data;
}
