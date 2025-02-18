import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';
import {ListServersDto, Pagination, ServerSummaryDto} from '@shared/dto';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';

export const serverListQuery = (data: ListServersDto) => {
    const queryClient = getQueryClient();

    return useQuery<Pagination<ServerSummaryDto>>(
        {
            queryKey: ['/servers', data],
            queryFn: async () => {
                const queryString =
                    Object.keys(data).length > 0
                        ? qs.stringify(data, {arrayFormat: 'brackets'})
                        : null;

                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/servers${
                        queryString ? `?${queryString}` : ''
                    }`,
                    {
                        withCredentials: true,
                    },
                );

                return response.data;
            },
        },
        queryClient,
    );
};
