import {parseResult, TError} from '@core';
import {ListServersDto, Pagination, ServerSummaryDto} from '@shared/dto';
import {evaluate, type EvaluateResult} from 'next-mdx-remote-client/rsc';
import {useQuery} from '@tanstack/react-query';
import {Result} from 'oxide.ts';
import qs from 'qs';
import {markdownComponentsWithoutAnchor} from '@front/components/atoms/CustomMdxRemote';
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

                const result: Result<
                    Pagination<ServerSummaryDto>,
                    TError
                > = parseResult(await response.json());

                if (result.isErr()) {
                    throw result.unwrapErr();
                }
                const servers = result.unwrap();

                const mappedItems = await Promise.all(
                    servers.items.map(
                        async (server) =>
                            <ServerPaginatedListWithMDXSource>{
                                ...server,
                                mdxSource: await evaluate({
                                    source: server?.description ?? '',
                                    components: markdownComponentsWithoutAnchor,
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
