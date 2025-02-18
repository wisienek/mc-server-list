'use client';

import {QueryClientProvider} from '@tanstack/react-query';
import {type ReactNode} from 'react';
import {getQueryClient} from './getQueryClient';
import {ReactQueryStreamedHydration} from '@tanstack/react-query-next-experimental';

export const ReactQueryClientProvider = ({children}: {children: ReactNode}) => {
    const queryClient = getQueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
        </QueryClientProvider>
    );
};
