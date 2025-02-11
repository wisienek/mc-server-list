'use client';

import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {type ReactNode, useState} from 'react';

export const ReactQueryClientProvider = ({children}: {children: ReactNode}) => {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        staleTime: 60 * 1_000,
                    },
                },
            }),
    );

    return (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};
