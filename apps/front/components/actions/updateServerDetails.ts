'use server';

import axios, {type AxiosResponse} from 'axios';
import {ServerDetailsDto, UpdateServerDetailsDto} from '@shared/dto';

export async function updateServerDetails(
    server: ServerDetailsDto,
): Promise<ServerDetailsDto | null> {
    try {
        const response = await axios.patch<
            ServerDetailsDto,
            AxiosResponse<ServerDetailsDto>,
            UpdateServerDetailsDto
        >(
            `${process.env.NEXT_PUBLIC_API_URL}/servers/${server.host}/details`,
            server,
        );

        return response.data;
    } catch (error) {
        console.error('Failed to update server:', error);
        return null;
    }
}
