import {ListServersDto, Pagination, ServerSummaryDto} from '@shared/dto';
import {useQuery} from '@tanstack/react-query';
import axios from 'axios';
import qs from 'qs';

export const serverListQuery = (data: ListServersDto) => {
    return useQuery<Pagination<ServerSummaryDto>>({
        queryKey: ['/servers', data],
        queryFn: async () => {
            const queryString = qs.stringify(data, {arrayFormat: 'brackets'});

            const response = await axios.get(
                `${process.env.NEXT_PUBLIC_API_URL}/servers?${queryString}`,
                {
                    withCredentials: true,
                },
            );

            return response.data;
        },
    });
};
