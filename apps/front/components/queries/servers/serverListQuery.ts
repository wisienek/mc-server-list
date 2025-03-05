import {ListServersDto, Pagination, ServerSummaryDto} from '@shared/dto';
import {evaluate, type EvaluateResult} from 'next-mdx-remote-client/rsc';
import {useQuery} from '@tanstack/react-query';
import qs from 'qs';
import {markdownComponents} from '@front/components/atoms/CustomMdxRemote';
import {getQueryClient} from '@lib/front/components/atoms/getQueryClient';

export type ServerPaginatedListWithMDXSource = {
    mdxSource: EvaluateResult<Record<string, unknown>, Record<string, unknown>>;
} & ServerSummaryDto;

export const serverListQuery = (data: ListServersDto) => {
    const queryClient = getQueryClient();

    return useQuery<Pagination<ServerPaginatedListWithMDXSource>>(
        {
            queryKey: ['/servers', data],
            queryFn: async () => {
                const queryString =
                    Object.keys(data).length > 0
                        ? qs.stringify(data, {arrayFormat: 'brackets'})
                        : null;

                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/servers${
                        queryString ? `?${queryString}` : ''
                    }`,
                    {
                        credentials: 'include',
                    },
                );

                const servers: Pagination<ServerSummaryDto> = await response.json();

                const mappedItems = await Promise.all(
                    servers.items.map(
                        async (server) =>
                            <ServerPaginatedListWithMDXSource>{
                                ...server,
                                mdxSource: await evaluate({
                                    source: server?.description ?? '',
                                    components: markdownComponents,
                                }),
                            },
                    ),
                );

                return {
                    ...servers,
                    items: mappedItems,
                } satisfies Pagination<ServerPaginatedListWithMDXSource>;
            },
        },
        queryClient,
    );
};
